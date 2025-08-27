import { object, ref, type InferType } from "yup"
import { passwordSchema } from "@/lib/validators/sign-up-schema"

export const ResetPasswordSchema = object({
  password: passwordSchema,
  confirmPassword: passwordSchema.oneOf([ref("password")], "Passwords must match")
})

export type ResetPasswordFormData = InferType<typeof ResetPasswordSchema>
