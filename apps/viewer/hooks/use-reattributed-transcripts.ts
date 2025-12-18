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

        let meetingStartTimeMs: number | null = null
        const events: NetworkSpeakerEvent[] = []

        for (const line of lines) {
          try {
            const parsed = JSON.parse(line)

            // Check if this is the start time event
            if (parsed.type === "start_time" && parsed.meetingStartTime) {
              meetingStartTimeMs = parsed.meetingStartTime
            } else if (parsed.name && parsed.timestamp !== undefined && parsed.isSpeaking !== undefined) {
              // This is a speaker event
              events.push(parsed as NetworkSpeakerEvent)
            }
          } catch (e) {
            console.warn("Failed to parse network event line:", e)
          }
        }

        if (!meetingStartTimeMs) {
          throw new Error("No meetingStartTime found in network file")
        }

        // Parse events into segments
        const segments = parseNetworkSegments(events)
        setNetworkSegments(segments)

        // Flatten all payload words
        const allWords = payloadTranscripts.flatMap((t) => t.words)

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
            }
          }

          // Skip empty segments
          if (segmentWords.length === 0) {
            continue
          }

          // Convert network segment timestamps to relative seconds
          const segmentStartSeconds = (segment.startMs - meetingStartTimeMs) / 1000
          const segmentEndSeconds = (segment.endMs - meetingStartTimeMs) / 1000

          const hasMismatch = segmentWords.some((w) => w.speakerMismatch)

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

        setTranscripts(reattributedTranscripts)
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
