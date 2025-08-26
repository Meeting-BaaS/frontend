import { generateUUID } from "@/lib/utils"
import { AI_CHAT_URL } from "@/lib/external-urls"

const CHAT_MESSAGE =
    "Hi, I have recently signed up for Meeting BaaS. I would like to know how to get started with sending bots"

/**
 * Creates a new chat with an initial welcome message
 * @param cookies - The cookies from the request
 * @returns The chat ID
 */
export async function createNewChat(cookies: string) {
    const chatId = generateUUID()
    const messageId = generateUUID()

    const chatResponse = await fetch(`${AI_CHAT_URL}/api/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Cookie: cookies
        },
        body: JSON.stringify({
            id: chatId,
            messages: [
                {
                    id: messageId,
                    role: "user",
                    parts: [
                        {
                            type: "text",
                            text: CHAT_MESSAGE
                        }
                    ],
                    createdAt: new Date()
                }
            ],
            selectedChatModel: "chat-model"
        })
    })

    if (!chatResponse.ok) {
        throw new Error(`Failed to create chat: ${chatResponse.status} ${chatResponse.statusText}`)
    }

    return chatId
}
