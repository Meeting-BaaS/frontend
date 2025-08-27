import { z } from "zod"
import type { EmailFrequency } from "@/lib/email-types"
import { emailTypeField } from "@/lib/schemas/content"

const frequencyOptions: EmailFrequency[] = ["Daily", "Weekly", "Monthly"] as const

export const broadcastFormSchema = z.object({
  emailType: emailTypeField,
  frequency: z.enum(frequencyOptions as [string, ...string[]], {
    required_error: "Please select a frequency"
  }),
  subject: z.string().trim().optional(),
  botCountLessThan: z.string().optional(),
  lastBotMoreThanDays: z.string().optional()
})

export type BroadcastFormValues = z.infer<typeof broadcastFormSchema>
