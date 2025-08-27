import { ProgressiveViewer } from "@/components/viewer/progressive-viewer"
import { getMeetingData } from "@/lib/api/meeting-data"
import { getAuthAppUrl } from "@/lib/auth/auth-app-url"
import { getAuthSession } from "@/lib/auth/session"
import { AlertCircle } from "lucide-react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { cache } from "react"
import isUUID from "validator/lib/isUUID"

const authAppUrl = getAuthAppUrl()
const getCachedAuthSession = cache(getAuthSession)

export default async function ViewerPage({
  params
}: {
  params: Promise<{ bot_uuid: string }>
}) {
  const [requestParams, requestHeaders] = await Promise.all([params, headers()])
  const { bot_uuid } = requestParams

  if (!bot_uuid || !isUUID(bot_uuid, 4)) {
    return (
      <div className="flex h-full w-full grow flex-col items-center justify-center gap-2 text-destructive">
        <AlertCircle className="size-8" />
        Invalid bot UUID
      </div>
    )
  }

  const requestCookies = requestHeaders.get("cookie")?.toString() || ""

  // RSCs need to pass cookies to getAuthSession
  const session = await getCachedAuthSession(requestCookies)

  if (!session) {
    // If the user is not authenticated, redirect to the sign-in page
    const redirectTo = requestHeaders.get("x-redirect-to")
    const redirectionUrl = redirectTo
      ? `${authAppUrl}/sign-in?redirectTo=${redirectTo}`
      : `${authAppUrl}/sign-in`
    redirect(redirectionUrl)
  }

  // First, load meeting data WITHOUT transcripts for faster initial load
  const meetingData = await getMeetingData(session.user.botsApiKey, bot_uuid, false)

  // Meeting data not found, either the bot is not found or the user doesn't have access to it
  if (!meetingData) {
    return (
      <div className="flex h-full w-full grow flex-col items-center justify-center gap-2 text-destructive">
        <AlertCircle className="size-8" />
        Meeting data not found
      </div>
    )
  }

  return (
    <ProgressiveViewer
      initialMeetingData={meetingData}
      apiKey={session.user.botsApiKey}
      botId={bot_uuid}
    />
  )
}
