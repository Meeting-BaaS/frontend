import { LOGS_URL } from "@/lib/external-urls"

interface PostMessageHandler {
  windowId: string
  botUuids: string[]
  onComplete?: () => void
}

export function setupPostMessageHandler({ windowId, botUuids, onComplete }: PostMessageHandler) {
  const handleReady = (event: MessageEvent) => {
    if (event.origin !== LOGS_URL) return
    if (event.data?.type === "ready" && event.data?.windowId === windowId) {
      if (!event.source) return
      ;(event.source as Window)?.postMessage(
        { type: "setBotUuids", uuids: botUuids, windowId },
        { targetOrigin: LOGS_URL }
      )
      // Remove this specific handler after successful communication
      window.removeEventListener("message", handleReady)
      onComplete?.()
    }
  }

  // Add event listener
  window.addEventListener("message", handleReady)

  // Clean up after 10 seconds
  setTimeout(() => {
    window.removeEventListener("message", handleReady)
  }, 10000)

  return handleReady
}
