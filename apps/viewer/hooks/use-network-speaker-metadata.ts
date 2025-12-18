import type { NetworkSpeakerMetadata } from "@/types/meeting-data"
import { useEffect, useState } from "react"

interface UseNetworkSpeakerMetadataOptions {
  metadataUrl?: string
  enabled?: boolean
}

interface UseNetworkSpeakerMetadataReturn {
  metadata: Map<number, NetworkSpeakerMetadata>
  isLoading: boolean
  error: string | null
}

export function useNetworkSpeakerMetadata({
  metadataUrl,
  enabled = true,
}: UseNetworkSpeakerMetadataOptions): UseNetworkSpeakerMetadataReturn {
  const [metadata, setMetadata] = useState<Map<number, NetworkSpeakerMetadata>>(
    new Map()
  )
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!metadataUrl || !enabled) {
      return
    }

    const fetchMetadata = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(metadataUrl)
        if (!response.ok) {
          throw new Error(`Failed to fetch metadata: ${response.status}`)
        }

        const text = await response.text()
        const lines = text.trim().split("\n").filter(Boolean)

        const metadataMap = new Map<number, NetworkSpeakerMetadata>()

        for (const line of lines) {
          try {
            const data = JSON.parse(line) as NetworkSpeakerMetadata
            if (data.type === "metadata") {
              metadataMap.set(data.id, data)
            }
          } catch (e) {
            console.warn("Failed to parse metadata line:", e)
          }
        }

        setMetadata(metadataMap)
      } catch (err) {
        console.error("Error fetching network speaker metadata:", err)
        setError(
          err instanceof Error ? err.message : "Failed to fetch metadata"
        )
      } finally {
        setIsLoading(false)
      }
    }

    fetchMetadata()
  }, [metadataUrl, enabled])

  return {
    metadata,
    isLoading,
    error,
  }
}
