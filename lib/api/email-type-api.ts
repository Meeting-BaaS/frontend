// Get a list of email types and their configuration

import type { EmailType } from "@/lib/email-types"
import { cookies } from "next/headers"

// This is called from RSCs and requires the complete URL + needs the cookies to be passed
export async function getEmailTypes(): Promise<EmailType[]> {
  const requestCookies = (await cookies()).toString()
  const response = await fetch(`${process.env.EMAIL_API_SERVER_BASEURL}/types`, {
    headers: {
      Cookie: requestCookies
    },
    next: {
      revalidate: 60 * 60 // 1 hour
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to get email types: ${response.status} ${response.statusText}`)
  }

  return (await response.json()).data as EmailType[]
}
