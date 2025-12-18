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

        // Re-attribute payload words with network speakers
        const reattributedTranscripts: ReattributedTranscript[] = payloadTranscripts.map(
          (transcript) => {
            const reattributedWords: ReattributedWord[] = transcript.words.map((word) => {
              // Convert payload word time to absolute timestamp
              const absoluteTimeMs = payloadTimeToAbsolute(word.start_time, meetingStartTimeMs)

              // Find network speaker at this time
              const networkSpeaker = findSpeakerAtTime(absoluteTimeMs, segments)

              const reattributedWord: ReattributedWord = {
                ...word,
                networkSpeaker: networkSpeaker?.speaker,
                networkSpeakerId: networkSpeaker?.speakerId,
                speakerMismatch:
                  networkSpeaker !== null &&
                  networkSpeaker.speaker !== transcript.speaker,
              }

              return reattributedWord
            })

            // Determine network speaker for the transcript segment
            // Use the most common network speaker among the words
            const networkSpeakerCounts = new Map<string, number>()
            for (const word of reattributedWords) {
              if (word.networkSpeaker) {
                networkSpeakerCounts.set(
                  word.networkSpeaker,
                  (networkSpeakerCounts.get(word.networkSpeaker) || 0) + 1
                )
              }
            }

            let dominantNetworkSpeaker: string | undefined
            let maxCount = 0
            for (const [speaker, count] of networkSpeakerCounts) {
              if (count > maxCount) {
                dominantNetworkSpeaker = speaker
                maxCount = count
              }
            }

            const hasMismatch = reattributedWords.some((w) => w.speakerMismatch)

            return {
              ...transcript,
              words: reattributedWords,
              networkSpeaker: dominantNetworkSpeaker,
              speakerMismatch: hasMismatch,
            }
          }
        )

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
