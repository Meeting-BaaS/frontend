import type { Transcript } from "@/types/meeting-data"
import { useEffect, useState } from "react"

interface UseNetworkTranscriptsOptions {
  diarizationUrl?: string
  enabled?: boolean
}

interface UseNetworkTranscriptsReturn {
  transcripts: Transcript[]
  isLoading: boolean
  error: string | null
}

export function useNetworkTranscripts({
  diarizationUrl,
  enabled = true,
}: UseNetworkTranscriptsOptions): UseNetworkTranscriptsReturn {
  const [transcripts, setTranscripts] = useState<Transcript[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!diarizationUrl || !enabled) {
      return
    }

    const fetchTranscripts = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(diarizationUrl)
        if (!response.ok) {
          throw new Error(`Failed to fetch transcripts: ${response.status}`)
        }

        const text = await response.text()
        const lines = text.trim().split("\n").filter(Boolean)

        const transcriptList: Transcript[] = []

        for (const line of lines) {
          try {
            const data = JSON.parse(line)
            // Filter for transcript entries (not metadata)
            if (data.type === "transcript" || (!data.type && data.speaker)) {
              transcriptList.push(data as Transcript)
            }
          } catch (e) {
            console.warn("Failed to parse transcript line:", e)
          }
        }

        setTranscripts(transcriptList)
      } catch (err) {
        console.error("Error fetching network transcripts:", err)
        setError(
          err instanceof Error ? err.message : "Failed to fetch transcripts"
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchTranscripts()
  }, [diarizationUrl, enabled])

  return {
    transcripts,
    isLoading,
    error,
  }
}
