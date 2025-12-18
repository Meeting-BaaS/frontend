"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@repo/shared/components/ui/avatar"
import { Button } from "@repo/shared/components/ui/button"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
import { Loader2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { scroller } from "react-scroll"
import HighlightedWord from "@/components/transcript/highlighted-word"
import { useNetworkSpeakerMetadata } from "@/hooks/use-network-speaker-metadata"
import { useReattributedTranscripts } from "@/hooks/use-reattributed-transcripts"
import type { MeetingDataResponse, Transcript, Word } from "@/types/meeting-data"

dayjs.extend(duration)

interface TranscriptProps {
  transcripts: Transcript[]
  currentTime: number
  onTimeChange: (time: number) => void
  isLoading?: boolean
  meetingData?: MeetingDataResponse
}

export default function TranscriptViewer({
  transcripts,
  currentTime,
  onTimeChange,
  isLoading = false,
  meetingData
}: TranscriptProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeWordId, setActiveWordId] = useState<number | null>(null)
  const [activeTranscriptId, setActiveTranscriptId] = useState<number | null>(null)
  const [isAutoScrolling, setIsAutoScrolling] = useState(true)
  const [showNetworkComparison, setShowNetworkComparison] = useState(false)

  const {
    transcripts: reattributedTranscripts,
    isLoading: isLoadingReattribution
  } = useReattributedTranscripts({
    payloadTranscripts: transcripts,
    networkDiarizationUrl: meetingData?.speaker_diarization_file_network,
    enabled: showNetworkComparison,
  })

  // Always fetch network metadata if available (even without comparison mode)
  // to enrich payload speakers with avatars and handle "unknown" speakers
  const { metadata: networkMetadata, isLoading: isLoadingMetadata } = useNetworkSpeakerMetadata({
    metadataUrl: meetingData?.speaker_metadata_file_network,
    enabled: !!meetingData?.speaker_metadata_file_network,
  })

  // Use reattributed transcripts when comparison is ON, otherwise use original
  const displayTranscripts = showNetworkComparison
    ? reattributedTranscripts
    : transcripts

  // Find the active word and transcript based on current time
  useEffect(() => {
    let foundWord: Word | null = null
    let foundTranscript: Transcript | null = null

    for (const transcript of displayTranscripts) {
      if (currentTime >= transcript.start_time) {
        for (const word of transcript.words) {
          if (currentTime >= word.start_time && currentTime <= word.end_time) {
            foundWord = word
            foundTranscript = transcript
            break
          }
        }
        if (foundWord) break
      }
    }

    if (foundWord) {
      setActiveWordId(foundWord.id)
      setActiveTranscriptId(foundTranscript?.id ?? null)
    }
  }, [currentTime, displayTranscripts])

  // Scroll to active transcript
  useEffect(() => {
    if (activeTranscriptId && isAutoScrolling) {
      scroller.scrollTo(`transcript-${activeTranscriptId}`, {
        duration: 500,
        smooth: true,
        containerId: "transcript-container",
        offset: -100
      })
    }
  }, [activeTranscriptId, isAutoScrolling])

  const handleWordClick = (startTime: number) => {
    onTimeChange?.(startTime)
    setIsAutoScrolling(false)
  }

  const getSpeakerInfo = (speakerName: string, networkSpeaker?: string) => {
    // Get info for the display speaker (network or payload)
    const displaySpeaker = showNetworkComparison && networkSpeaker ? networkSpeaker : speakerName
    const isUnknownSpeaker = !speakerName || speakerName.toLowerCase().includes("unknown")

    // Try to use network metadata if available
    if (networkMetadata.size > 0) {
      // First, try exact match with display speaker
      for (const meta of networkMetadata.values()) {
        if (meta.name === displaySpeaker || meta.fullName === displaySpeaker) {
          return {
            displayName: meta.displayName,
            fullName: meta.fullName,
            profilePicture: meta.profilePicture,
            originalSpeaker: speakerName,
            networkSpeaker: networkSpeaker,
          }
        }
      }

      // If speaker is "unknown" and we have metadata, try to infer
      // ONLY in network comparison mode
      if (isUnknownSpeaker && showNetworkComparison) {
        // If there's only one person in metadata, use that
        if (networkMetadata.size === 1) {
          const [meta] = networkMetadata.values()
          return {
            displayName: meta.displayName,
            fullName: meta.fullName,
            profilePicture: meta.profilePicture,
            originalSpeaker: speakerName,
            networkSpeaker: networkSpeaker,
          }
        }

        // If network speaker provided, try to match that
        if (networkSpeaker) {
          for (const meta of networkMetadata.values()) {
            if (meta.name === networkSpeaker || meta.fullName === networkSpeaker) {
              return {
                displayName: meta.displayName,
                fullName: meta.fullName,
                profilePicture: meta.profilePicture,
                originalSpeaker: speakerName,
                networkSpeaker: networkSpeaker,
              }
            }
          }
        }

        // Find the network metadata speaker NOT present in payload
        // Logic: Unknown must be the speaker from metadata who isn't already identified
        const knownPayloadSpeakers = new Set(
          displayTranscripts
            .map((t) => t.speaker)
            .filter((s) => s && !s.toLowerCase().includes("unknown"))
        )

        for (const meta of networkMetadata.values()) {
          const notInPayload =
            !knownPayloadSpeakers.has(meta.name) &&
            !knownPayloadSpeakers.has(meta.fullName)

          if (notInPayload) {
            // This must be the unknown speaker
            return {
              displayName: meta.displayName,
              fullName: meta.fullName,
              profilePicture: meta.profilePicture,
              originalSpeaker: speakerName,
              networkSpeaker: networkSpeaker,
            }
          }
        }
      }
    }

    // Fallback to speaker name if no metadata match
    return {
      displayName: displaySpeaker,
      fullName: displaySpeaker,
      profilePicture: undefined,
      originalSpeaker: speakerName,
      networkSpeaker: networkSpeaker,
    }
  }

  const hasNetworkDiarization = !!meetingData?.speaker_diarization_file_network

  return (
    <div
      ref={containerRef}
      id="transcript-container"
      className="relative mx-4 h-full max-h-[85svh] overflow-y-auto md:mt-6"
    >
      <div className="flex items-center justify-between gap-2 my-2 flex-wrap">
        <h3 className="font-bold md:mt-0 md:text-lg flex-shrink-0">
          Transcript {showNetworkComparison && "(Network)"}
        </h3>
        {hasNetworkDiarization && (
          <Button
            variant={showNetworkComparison ? "default" : "outline"}
            size="sm"
            onClick={() => setShowNetworkComparison(!showNetworkComparison)}
            disabled={isLoadingReattribution || isLoadingMetadata}
            className="text-xs flex-shrink-0"
          >
            Compare Network
          </Button>
        )}
      </div>

      {isLoading && (
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading transcript...
        </div>
      )}

      {!isLoading && (!transcripts || transcripts.length === 0) && (
        <p className="text-muted-foreground text-sm">No transcript available.</p>
      )}

      {!isAutoScrolling && (
        <div className="sticky top-0 right-0 left-0 z-10 flex w-full justify-center mb-2">
          <Button
            variant="secondary"
            onClick={() => setIsAutoScrolling(true)}
            className="shadow-md hover:bg-secondary/90"
          >
            Resume auto-scroll
          </Button>
        </div>
      )}

      {!isLoading &&
        displayTranscripts.map((transcript) => {
          const reattributed = transcript as any // Type assertion for network properties
          const speakerInfo = getSpeakerInfo(
            transcript.speaker,
            reattributed.networkSpeaker
          )

          const hasMismatch = showNetworkComparison && reattributed.speakerMismatch

          return (
            <div
              key={transcript.id}
              id={`transcript-${transcript.id}`}
              data-transcript-id={transcript.id}
              className={`my-4 ${hasMismatch ? "border-l-2 border-yellow-500 pl-2" : ""}`}
            >
              <div className="mb-0.5 flex items-center gap-3 text-muted-foreground">
                {showNetworkComparison && speakerInfo.profilePicture && (
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={speakerInfo.profilePicture} alt={speakerInfo.fullName} />
                    <AvatarFallback className="text-xs">
                      {speakerInfo.displayName.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div className="flex flex-col">
                  <span className="font-semibold text-sm" title={speakerInfo.fullName}>
                    {speakerInfo.displayName}
                  </span>
                  {showNetworkComparison && hasMismatch && speakerInfo.originalSpeaker !== speakerInfo.networkSpeaker && (
                    <span className="text-xs text-yellow-600 dark:text-yellow-500">
                      Payload: {speakerInfo.originalSpeaker}
                    </span>
                  )}
                </div>
                <span className="font-light text-xs">
                  {dayjs.duration(transcript.start_time * 1000).format("mm:ss")}
                </span>
              </div>
              <div className="text-sm">
                {transcript.words.map((word, index) => (
                  <HighlightedWord
                    key={word.id}
                    word={word}
                    isActive={word.id === activeWordId}
                    isNext={transcript.words[index + 1]?.id === activeWordId}
                    isPrevious={transcript.words[index - 1]?.id === activeWordId}
                    onWordClick={handleWordClick}
                  />
                ))}
              </div>
            </div>
          )
        })}
    </div>
  )
}
