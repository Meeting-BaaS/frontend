import { allEmailTypes } from "@/lib/filter-options"
import type { EmailId } from "@/lib/email-types"
import type { EmailLog } from "@/lib/broadcast-types"
import dayjs from "dayjs"
import type { SortingFn } from "@tanstack/react-table"

export const EmailIdTypeMap: Record<EmailId, string> = allEmailTypes.reduce(
  (acc, emailType) => {
    acc[emailType.value as EmailId] = emailType.label
    return acc
  },
  {} as Record<EmailId, string>
)

export const dateSort: SortingFn<EmailLog> = (rowA, rowB) => {
  const dateA = dayjs(rowA.original.sentAt)
  const dateB = dayjs(rowB.original.sentAt)

  return dateA.isBefore(dateB) ? -1 : dateA.isAfter(dateB) ? 1 : 0
}
