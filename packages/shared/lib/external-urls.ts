// For prod, the environment key is expected to be blank.
// For non-prod environments, NEXT_PUBLIC_ENVIRONMENT should be set to a domain prefix
// (e.g., "pre-prod-", "dev-") WITHOUT a trailing dot
const environment = process.env.NEXT_PUBLIC_ENVIRONMENT || ""

export const GLADIA_URL = "https://gladia.io"
export const CONTRIBUTION_GITHUB_URL = "https://github.com/Meeting-Baas"
export const MEETING_BAAS_HOMEPAGE_URL = "https://meetingbaas.com"
export const TERMS_AND_CONDITIONS_URL = "https://meetingbaas.com/terms-and-conditions"
export const PRIVACY_POLICY_URL = "https://meetingbaas.com/privacy"

// Define base domain
const BASE_DOMAIN = process.env.NEXT_PUBLIC_BASE_DOMAIN || "meetingbaas.com"

// Helper to construct environment-aware URLs
const createUrl = (subdomain: string) => {
  // If environment is set, apply it to the full domain (not between subdomain and domain)
  if (environment) {
    return `https://${subdomain}.${environment}${BASE_DOMAIN}`
  }
  // Otherwise, just use the subdomain directly
  return `https://${subdomain}.${BASE_DOMAIN}`
}

// Main app URL
export const AUTH_URL = createUrl("auth")

// Settings URLs
export const SETTINGS_URL = `https://settings.${environment}${BASE_DOMAIN}`
export const LOGS_URL = createUrl("logs")
export const BOT_ANALYTICS_URL = createUrl("analytics")
export const USAGE_URL = `${BOT_ANALYTICS_URL}/usage`
export const PRICING_URL = createUrl("pricing")
export const BILLING_URL = `${PRICING_URL}/billing`
export const CREDENTIALS_URL = `${SETTINGS_URL}/credentials`
export const STATUS_URL = createUrl("status")

// Docs URL
export const DOCS_URL = createUrl("docs")

/* External App URLs */

// Meeting BaaS API
export const MEETING_BAAS_API_DOCS_URL = `${DOCS_URL}/updates`
export const MEETING_BAAS_DOCS_GITHUB_URL = "https://github.com/Meeting-Baas/docs"

// AI Chat
export const AI_CHAT_URL = process.env.AI_CHAT_APP_URL || createUrl("chat")
export const AI_CHAT_GITHUB_URL = "https://github.com/Meeting-Baas/ai-chat"

export const DISCORD_URL = "https://discord.com/invite/dsvFgDTr6c"

// Real time transcription
export const REAL_TIME_TRANSCRIPTION_GITHUB_URL =
  "https://github.com/Meeting-Baas/realtime-meeting-transcription"

// Speaking Bots
export const SPEAKING_BOTS_DOCS_URL = `${DOCS_URL}/docs/speaking-bots`
export const SPEAKING_BOTS_GITHUB_URL = "https://github.com/Meeting-Baas/speaking-meeting-bot"

// Transcript Seeker
export const TRANSCRIPT_SEEKER_APP_URL = "https://app.transcriptseeker.com"
export const TRANSCRIPT_SEEKER_DOCS_URL = `${DOCS_URL}/docs/transcript-seeker`
export const TRANSCRIPT_SEEKER_GITHUB_URL = "https://github.com/Meeting-Baas/transcript-seeker"

// Github
export const GITHUB_REPO_URL = "https://github.com/Meeting-Baas/frontend"

export const V2_DASHBOARD_URL = createUrl("dashboard")
export const V2_DOCS_URL = `${DOCS_URL}/api-v2`
export const v2_INTRODUCTION_URL = "https://meetingbaas.com/en/api/introducing-meeting-baas-v2"

export const CONSUMPTION_URL = USAGE_URL

export const VIEWER_URL = createUrl("viewer")

//  Recording Viewer: build URL with dynamic recording `uuid` in the path.
export const RECORDING_VIEWER_URL = `${VIEWER_URL}/:uuid`

// Grafana
export const getGrafanaLogsUrl = (bot_uuid?: string) =>
  `https://meetingbaas.grafana.net/explore?schemaVersion=1&panes=%7B%225lu%22:%7B%22datasource%22:%22grafanacloud-logs%22,%22queries%22:%5B%7B%22refId%22:%22A%22,%22expr%22:%22%7Bbot_uuid%3D%5C%22${bot_uuid}%5C%22%7D+%7C%3D+%60%60%22,%22queryType%22:%22range%22,%22datasource%22:%7B%22type%22:%22loki%22,%22uid%22:%22grafanacloud-logs%22%7D,%22editorMode%22:%22builder%22,%22direction%22:%22backward%22%7D%5D,%22range%22:%7B%22from%22:%22now-2d%22,%22to%22:%22now%22%7D%7D%7D&orgId=1`

// Webhook testing URL
export const WEBHOOK_TEST_URL = "https://webhook.cool"
