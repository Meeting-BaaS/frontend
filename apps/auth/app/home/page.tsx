import type { Metadata } from "next"
import { auth } from "@/lib/auth"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import Header from "@/components/header"
import Home from "@/components/home"
import Footer from "@/components/footer"
import { getChatInfo } from "@/server/chat/chat-count"
import { createNewChat } from "@/server/chat/chat-api"
import { getAllBots } from "@/server/bots/bots-api"

export const metadata: Metadata = {
    title: "Developer Hub | Meeting BaaS",
    description:
        "Access Meeting BaaS tools, integrations, and utilities from one central dashboard."
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

    const chatInfo = await getChatInfo(sessionData.user.id)
    let chatId = chatInfo.earliestChatId

    // If the user has no bots and no chats, create a getting started chat.
    if (botCount === 0 && chatInfo.count === 0) {
        const newChatId = await createNewChat(requestCookies.toString())
        chatId = newChatId
    }

    const noBotsSent = botCount === 0

    return (
        <>
            <Header initialSession={sessionData} />
            <Home noBotsSent={noBotsSent} chatId={chatId} />
            <Footer />
        </>
    )
}
