import { Calendar, FileAudio, FileText, Key, Radio } from "lucide-react"
import type { SubscriptionStatus } from "@/lib/subscription/types"

export const subscriptionStatuses: Record<NonNullable<SubscriptionStatus>, string> = {
  active: "Active",
  canceled: "Canceled",
  incomplete: "Incomplete",
  incomplete_expired: "Incomplete Expired",
  past_due: "Past Due",
  paused: "Paused",
  trialing: "Trialing",
  unpaid: "Unpaid"
}

export const tokenRates = [
  {
    title: "Raw Recording",
    rate: "1.00 token",
    unit: "per hour",
    subtitle: "Includes speaker diarization",
    icon: FileAudio
  },
  {
    title: "Transcription",
    rate: "+0.25 token",
    unit: "per hour",
    subtitle: "Gladia transcription",
    icon: FileText
  },
  {
    title: "BYOK Transcription",
    rate: "+0.05 token",
    unit: "per hour",
    subtitle: "(Bring Your Own Key)",
    icon: Key
  },
  {
    title: "Streaming",
    rate: "+0.10 token",
    unit: "per hour",
    subtitle: "Per input or output",
    icon: Radio
  },
  {
    title: "Calendar Sync",
    rate: "Enterprise",
    unit: "plan only",
    icon: Calendar
  }
]
