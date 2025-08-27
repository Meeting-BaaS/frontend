import Footer from "@repo/shared/components/layout/footer"
import type { Metadata } from "next"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import Header from "@/components/header"
import Home from "@/components/home"
import { auth } from "@/lib/auth"
import { getAllBots } from "@/server/bots/bots-api"
import { createNewChat } from "@/server/chat/chat-api"
import { getChatInfo } from "@/server/chat/chat-count"

export const metadata: Metadata = {
  title: "Developer Hub | Meeting BaaS",
  description: "Access Meeting BaaS tools, integrations, and utilities from one central dashboard."
}

export default async function HomePage() {
  const [requestHeaders, requestCookies] = await Promise.all([headers(), cookies()])
  const jwt = requestCookies.get("jwt")?.value || ""
  const [sessionData, botCount] = await Promise.all([
    auth.api.getSession({ headers: requestHeaders }),
    getAllBots(jwt)
  ])

  if (!sessionData) {
    redirect("/sign-in")
  }

  const isAiChatEnabled = process.env.ENABLE_AI_CHAT_INTEGRATION === "true"
  const chatInfo = await getChatInfo(sessionData.user.id)
  let chatId = chatInfo.earliestChatId

  // If the user has no bots and no chats, create a getting started chat.
  if (isAiChatEnabled && botCount === 0 && chatInfo.count === 0) {
    const newChatId = await createNewChat(requestCookies.toString())
    chatId = newChatId
  }

  const noBotsSent = isAiChatEnabled && botCount === 0

  return (
    <>
      <Header initialSession={sessionData} />
      <Home noBotsSent={noBotsSent} chatId={chatId} />
      <Footer title="Authentication" />
    </>
  )
}
