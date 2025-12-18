import { useEffect, useState } from "react"
import type { Transcript, Word } from "@/types/meeting-data"
import {
  type NetworkSpeakerEvent,
  type NetworkSpeakerSegment,
  type NetworkStartTimeEvent,
  findSpeakerAtTime,
  parseNetworkSegments,
  payloadTimeToAbsolute,
} from "@/lib/network-speaker-utils"

export interface ReattributedWord extends Word {
  networkSpeaker?: string
  networkSpeakerId?: number
  speakerMismatch?: boolean // true if payload speaker !== network speaker
}

export interface ReattributedTranscript extends Omit<Transcript, "words"> {
  words: ReattributedWord[]
  networkSpeaker?: string // Network speaker for this segment
  speakerMismatch?: boolean // true if any words have mismatched speakers
}

interface UseReattributedTranscriptsOptions {
  payloadTranscripts: Transcript[]
  networkDiarizationUrl?: string
  enabled?: boolean
}

interface UseReattributedTranscriptsReturn {
  transcripts: ReattributedTranscript[]
  networkSegments: NetworkSpeakerSegment[]
  isLoading: boolean
  error: string | null
}

export function useReattributedTranscripts({
  payloadTranscripts,
  networkDiarizationUrl,
  enabled = true,
}: UseReattributedTranscriptsOptions): UseReattributedTranscriptsReturn {
  const [transcripts, setTranscripts] = useState<ReattributedTranscript[]>([])
  const [networkSegments, setNetworkSegments] = useState<NetworkSpeakerSegment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!networkDiarizationUrl || !enabled || payloadTranscripts.length === 0) {
      setTranscripts(payloadTranscripts as ReattributedTranscript[])
      return
    }

    const fetchAndReattribute = async () => {
      console.log("[Network Re-attribution] Starting fetch and reattribute")
      console.log("[Network Re-attribution] URL:", networkDiarizationUrl)
      console.log("[Network Re-attribution] Payload transcripts count:", payloadTranscripts.length)

      setIsLoading(true)
      setError(null)

      try {
        // Fetch network events
        const response = await fetch(networkDiarizationUrl)
        if (!response.ok) {
          throw new Error(`Failed to fetch network events: ${response.status}`)
        }

        const text = await response.text()
        const lines = text.trim().split("\n").filter(Boolean)
        console.log("[Network Re-attribution] Fetched lines:", lines.length)

        let meetingStartTimeMs: number | null = null
        const events: NetworkSpeakerEvent[] = []

        for (const line of lines) {
          try {
            const parsed = JSON.parse(line)

            // Handle both array format [{}] and object format {}
            const items = Array.isArray(parsed) ? parsed : [parsed]

            // Process all items in the array
            for (const data of items) {
              // Check if this is the start time event
              if (data?.type === "start_time" && data.meetingStartTime) {
                meetingStartTimeMs = data.meetingStartTime
                const startTime = data.meetingStartTime
                console.log("[Network Re-attribution] Meeting start time:", startTime, new Date(startTime).toISOString())
              } else if (data?.name && data.timestamp !== undefined && data.isSpeaking !== undefined) {
                // This is a speaker event - add it (we'll parse segments later)
                events.push(data as NetworkSpeakerEvent)
              }
            }
          } catch (e) {
            console.warn("Failed to parse network event line:", e)
          }
        }

        console.log("[Network Re-attribution] Speaker events:", events.length)

        if (!meetingStartTimeMs) {
          throw new Error("No meetingStartTime found in network file")
        }

        // Parse events into segments
        const segments = parseNetworkSegments(events)
        console.log("[Network Re-attribution] Parsed segments:", segments.length)
        console.log("[Network Re-attribution] First 3 segments:", segments.slice(0, 3))
        setNetworkSegments(segments)

        // Flatten all payload words
        const allWords = payloadTranscripts.flatMap((t) => t.words)
        console.log("[Network Re-attribution] Total payload words:", allWords.length)
        console.log("[Network Re-attribution] First word time:", allWords[0]?.start_time, "seconds")

        // Track which words have been matched to network segments
        const matchedWordIds = new Set<number>()

        // Group words by network segments
        const reattributedTranscripts: ReattributedTranscript[] = []

        for (let index = 0; index < segments.length; index++) {
          const segment = segments[index]

          // Find all words that fall within this network segment
          const segmentWords: ReattributedWord[] = []

          for (const word of allWords) {
            const absoluteTimeMs = payloadTimeToAbsolute(word.start_time, meetingStartTimeMs)

            // Check if word falls within this segment
            if (absoluteTimeMs >= segment.startMs && absoluteTimeMs <= segment.endMs) {
              // Find original payload speaker for this word
              const originalTranscript = payloadTranscripts.find((t) =>
                t.words.some((w) => w.id === word.id)
              )

              segmentWords.push({
                ...word,
                networkSpeaker: segment.speaker,
                networkSpeakerId: segment.speakerId,
                speakerMismatch:
                  originalTranscript?.speaker !== segment.speaker,
              })
              matchedWordIds.add(word.id)
            }
          }

          // Skip empty segments
          if (segmentWords.length === 0) {
            console.log(`[Network Re-attribution] Segment ${index} is empty, skipping`)
            continue
          }

          // Convert network segment timestamps to relative seconds
          const segmentStartSeconds = (segment.startMs - meetingStartTimeMs) / 1000
          const segmentEndSeconds = (segment.endMs - meetingStartTimeMs) / 1000

          const hasMismatch = segmentWords.some((w) => w.speakerMismatch)

          console.log(`[Network Re-attribution] Segment ${index}: ${segment.speaker}, ${segmentWords.length} words, start: ${segmentStartSeconds.toFixed(2)}s`)

          reattributedTranscripts.push({
            id: index,
            speaker: segment.speaker,
            bot_id: payloadTranscripts[0]?.bot_id || 0,
            start_time: segmentStartSeconds,
            end_time: null,
            words: segmentWords,
            user_id: null,
            lang: null,
            networkSpeaker: segment.speaker,
            speakerMismatch: hasMismatch,
          })
        }

        // Add unmatched words using original payload structure
        console.log("[Network Re-attribution] Matched words:", matchedWordIds.size, "of", allWords.length)
        const unmatchedWords = allWords.filter(w => !matchedWordIds.has(w.id))
        if (unmatchedWords.length > 0) {
          console.log("[Network Re-attribution] Adding unmatched words:", unmatchedWords.length)

          // Group unmatched words by original transcript
          for (const transcript of payloadTranscripts) {
            const transcriptUnmatchedWords = transcript.words
              .filter(w => !matchedWordIds.has(w.id))
              .map(w => ({ ...w, networkSpeaker: undefined, networkSpeakerId: undefined, speakerMismatch: false }))

            if (transcriptUnmatchedWords.length > 0) {
              reattributedTranscripts.push({
                ...transcript,
                words: transcriptUnmatchedWords,
                networkSpeaker: undefined,
                speakerMismatch: false,
              })
            }
          }
        }

        // Sort all transcripts by start time to maintain chronological order
        reattributedTranscripts.sort((a, b) => a.start_time - b.start_time)

        console.log("[Network Re-attribution] Final reattributed transcripts (before merging):", reattributedTranscripts.length)

        // Merge consecutive segments from the same speaker (max ~300 words per segment)
        const MAX_WORDS_PER_SEGMENT = 300
        const mergedTranscripts: ReattributedTranscript[] = []

        for (const transcript of reattributedTranscripts) {
          const lastMerged = mergedTranscripts[mergedTranscripts.length - 1]

          // Check if we can merge with the previous segment
          const canMerge = lastMerged &&
                          lastMerged.speaker === transcript.speaker &&
                          lastMerged.words.length < MAX_WORDS_PER_SEGMENT

          if (canMerge) {
            // Check if adding this would exceed limit
            const wouldExceed = lastMerged.words.length + transcript.words.length > MAX_WORDS_PER_SEGMENT

            if (wouldExceed) {
              // Find nearest punctuation to split at
              const remainingSpace = MAX_WORDS_PER_SEGMENT - lastMerged.words.length
              let splitIndex = remainingSpace

              // Look backwards from split point for punctuation
              const punctuationMarks = ['.', '!', '?', '。', '！', '？']
              for (let i = splitIndex; i >= Math.max(0, splitIndex - 50); i--) {
                if (i < transcript.words.length && punctuationMarks.some(mark => transcript.words[i].text.includes(mark))) {
                  splitIndex = i + 1 // Include the punctuation word
                  break
                }
              }

              // Add words up to split point to current segment
              const wordsToAdd = transcript.words.slice(0, splitIndex)
              lastMerged.words.push(...wordsToAdd)

              // Create new segment with remaining words
              if (splitIndex < transcript.words.length) {
                mergedTranscripts.push({
                  ...transcript,
                  words: transcript.words.slice(splitIndex)
                })
              }
              console.log(`[Network Re-attribution] Split at punctuation: ${lastMerged.words.length} words, new segment: ${transcript.words.length - splitIndex} words`)
            } else {
              // Merge entirely
              lastMerged.words.push(...transcript.words)
              console.log(`[Network Re-attribution] Merged segment into previous, now ${lastMerged.words.length} words`)
            }
          } else {
            // Add as new segment
            mergedTranscripts.push(transcript)
          }
        }

        console.log("[Network Re-attribution] Final merged transcripts:", mergedTranscripts.length)
        console.log("[Network Re-attribution] Setting transcripts...")
        setTranscripts(mergedTranscripts)
      } catch (err) {
        console.error("Error fetching and reattributing transcripts:", err)
        setError(
          err instanceof Error ? err.message : "Failed to reattribute transcripts"
        )
        // Fallback to original transcripts
        setTranscripts(payloadTranscripts as ReattributedTranscript[])
      } finally {
        setIsLoading(false)
      }
    }

    fetchAndReattribute()
  }, [networkDiarizationUrl, enabled, payloadTranscripts])

  return {
    transcripts,
    networkSegments,
    isLoading,
    error,
  }
}
