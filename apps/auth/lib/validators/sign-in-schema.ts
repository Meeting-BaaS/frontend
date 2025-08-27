import { object, type InferType } from "yup"
import { emailSchema, passwordSchema } from "@/lib/validators/sign-up-schema"

export const SignInSchema = object({
  email: emailSchema,
  password: passwordSchema
})

export type SignInFormData = InferType<typeof SignInSchema>
