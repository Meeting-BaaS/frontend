import type { EmailDomain, EmailType } from "@/lib/email-types"

// Group email types by domain
export const getEmailsByDomain = (types: EmailType[], domain: EmailDomain) => {
  return types.filter((email) => email.domain === domain)
}

// Find email type by ID
export const findEmailTypeById = (types: EmailType[], id: string) => {
  return types.find((type) => type.id === id)
}
