import { AI_CHAT_URL as AI_CHAT_URL_EXTERNAL } from "@repo/shared/lib/external-urls"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const AI_CHAT_URL = process.env.AI_CHAT_APP_URL || AI_CHAT_URL_EXTERNAL

export type McpServerSpec = {
  name: string
  displayName: string
  description: string
  githubUrl: string
  serverUrl?: string
  envVars?: { label: string; value: string | null; sensitive?: boolean }[]
  localConfig?: object
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const newChatMessage =
  "Hi, can you please send a bot to this meeting (provided a meeting link) or try other API calls?"

export function getConfigJson(server: McpServerSpec, reveal: boolean, apiKey?: string) {
  const env: Record<string, string> = {}
  if (server.envVars) {
    for (const envVar of server.envVars) {
      if ((envVar.label === "API_KEY" || envVar.label === "x-meeting-baas-api-key") && apiKey) {
        env[envVar.label] = apiKey
      } else {
        env[envVar.label] = envVar.sensitive && !reveal ? "********" : envVar.value || ""
      }
    }
  }
  return JSON.stringify(
    {
      name: server.name,
      description: server.description,
      githubUrl: server.githubUrl,
      env
    },
    null,
    2
  )
}

export function getChatUrl(chatId: string | null) {
  // If the chatId is provided, redirect to the chat.
  if (chatId) {
    return `${AI_CHAT_URL}/chat/${chatId}`
  }
  const searchParams = new URLSearchParams()
  searchParams.set("new_chat_message", newChatMessage)
  return `${AI_CHAT_URL}?${searchParams.toString()}`
}

/**
 * Generates a UUID
 * A custom UUID function is used to keep the same UUID format as the AI Chat repository.
 * @returns A UUID.
 */
export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
