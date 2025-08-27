// Meeting BaaS environment prefix for app URLs. For lower environments, it would be something like pre-prod-
// It would be empty for prod.
const environment = process.env.NEXT_PUBLIC_ENVIRONMENT || ""

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

// Chat App
export const AI_CHAT_URL = createUrl("chat")

// Meeting BaaS home page
export const MEETING_BAAS_HOMEPAGE_URL = `https://${environment}${BASE_DOMAIN}`

// Terms of use
export const TERMS_AND_CONDITIONS_URL = `${MEETING_BAAS_HOMEPAGE_URL}/terms-and-conditions`

// Privacy policy
export const PRIVACY_POLICY_URL = `${MEETING_BAAS_HOMEPAGE_URL}/privacy`

// Utility
export const SETTINGS_URL = createUrl("settings")
export const CREDENTIALS_URL = `${SETTINGS_URL}/credentials`
export const CONSUMPTION_URL = `${createUrl("analytics")}/usage`
export const LOGS_URL = `${createUrl("logs")}`
export const BILLING_URL = `${createUrl("pricing")}/billing`

// Github
export const GITHUB_REPO_URL = "https://github.com/Meeting-Baas/pricing"
