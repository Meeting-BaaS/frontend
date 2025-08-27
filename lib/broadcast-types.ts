import type { EmailFrequency, EmailType } from "@/lib/email-types"

export type Content = {
  id: number
  emailType: EmailType["id"]
  content: string
  contentText: string
  createdAt: string
  accountId: string
  name: string
}

export type RecipientParams = {
  emailId: EmailType["id"]
  frequency: EmailFrequency
  botCountLessThan?: string
  lastBotMoreThanDays?: string
}

export type Recipient = {
  email: string
  firstname: string
  lastname: string
}

export type RecipientStatus = "sent" | "error" | "skipped"

export type RecipientWithStatus = Recipient & {
  status: RecipientStatus
}

export type BroadcastParams = {
  emailId: EmailType["id"]
  frequency: EmailFrequency
  subject: string
  contentIds: Content["id"][]
  recipients: Recipient[]
}

export type EmailLogParams = {
  offset: number
  limit: number
  startDate: string | null
  endDate: string | null
  emailId?: string // Comma separated list of email types
  accountEmail?: string
}

export type EmailLog = {
  id: number
  emailType: EmailType["id"]
  sentAt: string
  subject: string
  triggeredBy: string
  email: string
  fullName: string
}

export type EmailLogResponse = {
  data: EmailLog[]
  hasMore: boolean
}

export interface ContentMutationError extends Error {
  previousState?: Content[]
}
