import { Button } from "@/components/ui/button"
import { Download, File, Loader2 } from "lucide-react"
import { useMemo, useState } from "react"
import type { MeetingDataResponse } from "@/types/meeting-data"
import { toast } from "sonner"
import { getPlatformFromUrl } from "@/lib/utils"
import { ZoomLogo } from "../icons/zoom"
import { MicrosoftTeamsLogo } from "../icons/microsoft-teams"
import { GoogleMeetLogo } from "../icons/google-meet"

const iconClasses = "size-6"

interface VideoDetailsProps {
  meetingData: MeetingDataResponse
}

export function VideoDetails({ meetingData }: VideoDetailsProps) {
  const {
    bot_data: {
      bot: { bot_name, uuid, meeting_url }
    },
    mp4
  } = meetingData
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = () => {
    if (isDownloading || !mp4) return
    setIsDownloading(true)

    fetch(mp4)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = url
        link.download = `${bot_name}-${uuid}.mp4`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
      })
      .catch((error) => {
        console.error("Failed to download video", error)
        toast.error("Failed to download video.")
      })
      .finally(() => {
        setIsDownloading(false)
      })
  }

  const handleDownloadJSON = () => {
    const dataStr = JSON.stringify(meetingData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${bot_name}-${uuid}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const platform = getPlatformFromUrl(meeting_url)

  const platformIcon = useMemo(() => {
    switch (platform) {
      case "zoom":
        return <ZoomLogo className={iconClasses} />
      case "teams":
        return <MicrosoftTeamsLogo className={iconClasses} />
      case "google meet":
        return <GoogleMeetLogo className={iconClasses} />
      default:
        return null
    }
  }, [platform])

  return (
    <div className="m-4 flex flex-col items-start justify-between gap-2 md:mx-0 md:flex-row">
      <div className="space-y-1">
        <h2 className="flex items-center gap-3 font-semibold md:text-lg">
          {platformIcon} {bot_name}
        </h2>
        <p className="text-muted-foreground text-sm">Bot UUID: {uuid}</p>
      </div>
      <div className="flex w-full gap-2 md:w-auto">
        <Button
          onClick={handleDownloadJSON}
          variant="outline"
          size="sm"
          className="w-1/2 md:w-auto"
        >
          <File />
          Download JSON
        </Button>
        <Button onClick={handleDownload} variant="outline" size="sm" className="w-1/2 md:w-auto">
          {isDownloading ? (
            <>
              <Loader2 className="animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <Download />
              Download Video
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
