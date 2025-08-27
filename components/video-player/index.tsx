"use client"

import { useEffect, useRef } from "react"
import ReactPlayer from "react-player"

export interface VideoPlayerProps {
  url: string
  seekTo?: number
  onProgress?: (state: {
    played: number
    playedSeconds: number
    loaded: number
    loadedSeconds: number
  }) => void
  onDuration?: (duration: number) => void
}

export default function VideoPlayer({ url, seekTo, onProgress, onDuration }: VideoPlayerProps) {
  const playerRef = useRef<ReactPlayer>(null)

  useEffect(() => {
    if (seekTo !== undefined && playerRef.current) {
      playerRef.current.seekTo(seekTo)
    }
  }, [seekTo])

  return (
    <div className="flex flex-col">
      <div className="relative size-full">
        <ReactPlayer
          ref={playerRef}
          url={url}
          width="100%"
          height="100%"
          controls
          preload="auto"
          crossOrigin
          onProgress={onProgress}
          onDuration={onDuration}
          progressInterval={100}
          config={{
            file: {
              attributes: {
                disablePictureInPicture: true
              }
            }
          }}
        />
      </div>
    </div>
  )
}
