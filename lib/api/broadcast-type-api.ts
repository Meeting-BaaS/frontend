// Get a list of email types and their configuration

import type { EmailType } from "@/lib/email-types"
import { cookies } from "next/headers"

/**
 * Get a list of broadcast types and their configuration
 * This is called from RSCs and requires the complete URL + needs the cookies to be passed
 * @returns Email types which are broadcast types
 */
export async function getBroadcastTypes(): Promise<EmailType[]> {
  const requestCookies = (await cookies()).toString()
  const response = await fetch(`${process.env.EMAIL_API_SERVER_BASEURL}/admin/broadcast-types`, {
    headers: {
      Cookie: requestCookies
    },
    next: {
      revalidate: 60 * 60 // 1 hour
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to get broadcast types: ${response.status} ${response.statusText}`)
  }

  return (await response.json()).data as EmailType[]
}
