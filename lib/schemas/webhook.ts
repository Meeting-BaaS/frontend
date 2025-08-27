import { z } from "zod"
import isURL from "validator/lib/isURL"

export const webhookSchema = z.object({
  webhook_url: z
    .string()
    .trim()
    .min(1, "Please enter a webhook path")
    .max(2048, "URL must be less than 2048 characters")
    .refine((url) => isURL(url, { require_protocol: true }), "Please enter a valid URL")
})

export type WebhookFormData = z.infer<typeof webhookSchema>
