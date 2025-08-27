"use client"

import TranscriptViewer from "@/components/transcript"
import type { VideoPlayerProps } from "@/components/video-player"
import type { MeetingDataResponse } from "@/types/meeting-data"
import dynamic from "next/dynamic"
import { useState } from "react"
import { VideoDetails } from "../video-player/video-details"

const VideoPlayer = dynamic(() => import("@/components/video-player"), { ssr: false })

interface ViewerProps {
  meetingData: MeetingDataResponse
  isLoadingTranscripts?: boolean
}

export function Viewer({ meetingData, isLoadingTranscripts = false }: ViewerProps) {
  const [currentTime, setCurrentTime] = useState(0)
  const [seekTime, setSeekTime] = useState<number | undefined>(undefined)
  const {
    bot_data: { transcripts = [] }
  } = meetingData

  const handleProgress: VideoPlayerProps["onProgress"] = (state: {
    played: number
    playedSeconds: number
    loaded: number
    loadedSeconds: number
  }) => {
    setCurrentTime(state.playedSeconds)
  }

  const handleTimeChange = (time: number) => {
    setSeekTime(time)
  }

  return (
    <div className="flex grow flex-col md:mx-8">
      <div className="flex w-full grow flex-col md:flex-row">
        <div className="w-full md:mt-6 md:mr-4 md:w-3/4">
          <VideoPlayer url={meetingData.mp4} onProgress={handleProgress} seekTo={seekTime} />
          <VideoDetails meetingData={meetingData} />
        </div>
        <div className="w-full border-t md:w-1/4 md:border-t-0 md:border-l">
          <TranscriptViewer
            transcripts={transcripts}
            currentTime={currentTime}
            onTimeChange={handleTimeChange}
            isLoading={isLoadingTranscripts}
          />
        </div>
      </div>
    </div>
  )
}
