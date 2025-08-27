import type { UserReportedError } from "@/components/logs-table/types"

/**
 * Returns the variant for the error status.
 * @param status - The status of the error.
 * @returns The variant for the error status.
 */
export function getErrorStatusVariant(status: UserReportedError["status"]) {
  switch (status) {
    case "open":
      return "destructive"
    case "in_progress":
      return "warning"
    case "closed":
      return "default"
    default:
      return "outline"
  }
}

export function isMeetingBaasUser(email?: string) {
  const domain = process.env.NEXT_PUBLIC_BASE_DOMAIN || "meetingbaas.com"
  if (!email) return false
  // At times, NEXT_PUBLIC_BASE_DOMAIN can differ from meetingbaas.com
  // In such cases, we need to check for both domains
  return email.endsWith(`@${domain}`) || email.endsWith("@meetingbaas.com")
}
