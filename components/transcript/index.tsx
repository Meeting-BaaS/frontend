"use client"

import { Button } from "@/components/ui/button"
import type { Transcript, Word } from "@/types/meeting-data"
import dayjs from "dayjs"
import duration from "dayjs/plugin/duration"
import { Loader2 } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { scroller } from "react-scroll"
import HighlightedWord from "./highlighted-word"

dayjs.extend(duration)

interface TranscriptProps {
  transcripts: Transcript[]
  currentTime: number
  onTimeChange: (time: number) => void
  isLoading?: boolean
}

export default function TranscriptViewer({
  transcripts,
  currentTime,
  onTimeChange,
  isLoading = false
}: TranscriptProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeWordId, setActiveWordId] = useState<number | null>(null)
  const [activeTranscriptId, setActiveTranscriptId] = useState<number | null>(null)
  const [isAutoScrolling, setIsAutoScrolling] = useState(true)

  // Find the active word and transcript based on current time
  useEffect(() => {
    let foundWord: Word | null = null
    let foundTranscript: Transcript | null = null

    for (const transcript of transcripts) {
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
  }, [currentTime, transcripts])

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

  return (
    <div
      ref={containerRef}
      id="transcript-container"
      className="relative mx-4 h-full max-h-[85svh] overflow-y-auto md:mt-6"
    >
      <h3 className="my-2 font-bold md:mt-0 md:text-lg">Transcript</h3>

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
        <div className="-mt-9 sticky top-5 right-0 left-0 z-10 flex w-full justify-center">
          <Button
            variant="secondary"
            onClick={() => setIsAutoScrolling(true)}
            className="shadow-md hover:bg-secondary/90"
          >
            Resume auto-scroll
          </Button>
        </div>
      )}

      {!isLoading && transcripts.map((transcript) => (
        <div
          key={transcript.id}
          id={`transcript-${transcript.id}`}
          data-transcript-id={transcript.id}
          className="my-4"
        >
          <div className="mb-0.5 flex items-center gap-3 text-muted-foreground">
            <span className="font-semibold text-sm">{transcript.speaker}</span>{" "}
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
      ))}
    </div>
  )
}
