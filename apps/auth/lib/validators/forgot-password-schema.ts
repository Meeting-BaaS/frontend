import { object, type InferType } from "yup"
import { emailSchema } from "@/lib/validators/sign-up-schema"

export const ForgotPasswordSchema = object({
  email: emailSchema
})

export type ForgotPasswordFormData = InferType<typeof ForgotPasswordSchema>
