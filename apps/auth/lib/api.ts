export async function getWebhookUrl(): Promise<string> {
  const response = await fetch("/api/baas/accounts/webhook_url")

  if (!response.ok) {
    throw new Error(`Failed to get webhook url: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data.webhook_url
}
