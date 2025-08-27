"use client"

import { Button } from "@/components/ui/button"
import { useProgressiveTranscripts } from "@/hooks/use-progressive-transcripts"
import type { MeetingDataResponse } from "@/types/meeting-data"
import { AlertCircle, Loader2, RotateCcw } from "lucide-react"
import { Viewer } from "./index"

interface ProgressiveViewerProps {
    initialMeetingData: MeetingDataResponse
    apiKey: string
    botId: string
}

export function ProgressiveViewer({
    initialMeetingData,
    apiKey,
    botId
}: ProgressiveViewerProps) {
    const {
        meetingData,
        isLoadingTranscripts,
        transcriptsLoaded,
        error,
        retryLoading
    } = useProgressiveTranscripts({
        initialMeetingData,
        apiKey,
        botId
    })

    return (
        <div className="relative">
            <Viewer
                meetingData={meetingData}
                isLoadingTranscripts={isLoadingTranscripts}
            />

            {/* Transcript loading indicator */}
            {!transcriptsLoaded && (
                <div className="absolute top-4 right-4 md:top-6 md:right-8">
                    <div className="flex items-center gap-2 rounded-lg bg-background/80 backdrop-blur-sm border px-3 py-2 text-sm">
                        {isLoadingTranscripts ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Loading transcripts...
                            </>
                        ) : error ? (
                            <>
                                <AlertCircle className="h-4 w-4 text-destructive" />
                                <span className="text-destructive">Failed to load transcripts</span>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={retryLoading}
                                    className="ml-2 h-6 px-2"
                                >
                                    <RotateCcw className="h-3 w-3" />
                                </Button>
                            </>
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    )
} 