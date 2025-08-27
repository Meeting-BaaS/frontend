import { clsx, type ClassValue } from "clsx"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import relativeTime from "dayjs/plugin/relativeTime"
import { twMerge } from "tailwind-merge"

dayjs.extend(utc)
dayjs.extend(relativeTime)

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isMeetingBaasUser(email?: string) {
  const domain = process.env.NEXT_PUBLIC_BASE_DOMAIN || "meetingbaas.com"
  if (!email) return false
  return email.endsWith(`@${domain}`)
}

export const formatSentAt = (dateStr: string) => {
  // Parse the date as UTC and convert to local timezone
  const date = dayjs.utc(dateStr).local()
  const now = dayjs()

  // If the date is more than 7 days old, show the full date
  if (now.diff(date, "day") > 7) {
    return date.format("D MMM YYYY, h:mm A")
  }

  // Otherwise show relative time
  return date.fromNow()
}
