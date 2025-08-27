import type { EmailDomain, EmailFrequency, EmailPreferences, EmailType } from "@/lib/email-types"
import { getEmailsByDomain } from "@/components/email-preferences/email-categories"

// Function to check if all emails in a domain have the same frequency setting
export const getDomainFrequency = (
  domain: EmailDomain,
  preferences: EmailPreferences | undefined,
  emailTypes: EmailType[]
): EmailFrequency | "Mixed" => {
  // Edge case: Handle missing preferences or invalid domain
  if (!preferences || !domain) return "Never"

  // Only consider non-required emails for domain frequency
  const emailsInDomain = getEmailsByDomain(emailTypes, domain).filter((e) => !e.required)

  // If there are no non-required emails in this domain, return 'Never'
  if (emailsInDomain.length === 0) return "Never"

  const firstFreq = preferences[emailsInDomain[0].id]
  // Edge case: Handle missing frequency for first email
  if (!firstFreq) return "Never"

  const allSame = emailsInDomain.every((e) => preferences[e.id] === firstFreq)

  return allSame ? firstFreq : "Mixed"
}

/**
 * Update the frequency for all emails in a domain.
 * @param domain - The domain to update
 * @param frequency - The frequency to set
 * @param old - The old preferences
 * @param emailTypes - The list of all email types
 * @returns The new preferences
 */
export const getUpdatedDomainFrequency = (
  domain: EmailDomain,
  frequency: EmailFrequency,
  old: EmailPreferences,
  emailTypes: EmailType[]
) => {
  const newPreferences = { ...old }
  const emailsInDomain = getEmailsByDomain(emailTypes, domain)

  for (const emailType of emailsInDomain) {
    // Skip required emails if the requested frequency is "Never"
    if (emailType.required && frequency === "Never") continue

    // Set the frequency
    newPreferences[emailType.id] = frequency
  }

  return newPreferences
}
