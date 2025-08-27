import { PageTitle } from "@/components/page-title"
import { isMeetingBaasUser } from "@/lib/utils"
import { getAuthSession } from "@/lib/auth/session"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { cache } from "react"
import { getBroadcastTypes } from "@/lib/api/broadcast-type-api"
import { SendBroadcast } from "@/components/broadcasts/send-broadcast"

// Cache the getBroadcastTypes call
const getCachedBroadcastTypes = cache(getBroadcastTypes)

export default async function SendBroadcastPage() {
  const requestCookies = await cookies()
  // RSCs need to pass cookies to getAuthSession
  const [session, broadcastTypes] = await Promise.all([
    getAuthSession(requestCookies.toString()),
    getCachedBroadcastTypes()
  ])

  const isMeetingBaas = isMeetingBaasUser(session?.user?.email)

  if (!isMeetingBaas) {
    redirect("/")
  }

  return (
    <>
      <PageTitle title="Broadcasts" description="Send a broadcast to subscribed users." />
      <SendBroadcast broadcastTypes={broadcastTypes} />
    </>
  )
}
