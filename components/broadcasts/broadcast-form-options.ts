import type { EmailFrequency } from "@/lib/email-types"

export const FrequencySelectOptions: { value: EmailFrequency; label: string }[] = [
  { value: "Daily", label: "Daily subscribers" },
  { value: "Weekly", label: "Weekly subscribers" },
  { value: "Monthly", label: "Monthly subscribers" }
]

export const botCountOptions: { label: string; value: string }[] = [
  { label: "None", value: "0 bots" },
  { label: "Less than 5", value: "5 bots" },
  { label: "Less than 10", value: "10 bots" },
  { label: "Less than 20", value: "20 bots" },
  { label: "Less than 50", value: "50 bots" }
]

export const lastBotDaysOptions: { label: string; value: string }[] = [
  { label: "More than 10 days", value: "10 days" },
  { label: "More than a month", value: "30 days" },
  { label: "More than 6 months", value: "180 days" },
  { label: "More than a year", value: "365 days" }
]
