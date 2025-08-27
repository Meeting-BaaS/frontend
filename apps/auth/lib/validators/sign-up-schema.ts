import { object, boolean, type InferType, string } from "yup"
import isStrongPassword from "validator/lib/isStrongPassword"

export const emailSchema = string()
  .trim()
  .required("Please enter email")
  .email("Please enter a valid email")
  .max(255, "Email is too long")

export const passwordSchema = string()
  .trim()
  .required("Please enter password")
  .max(100, "Password is too long")
  .test(
    "is-strong-password",
    "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 symbol.",
    (value) => {
      return isStrongPassword(value, {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
      })
    }
  )

export const SignUpSchema = object({
  name: string().trim().required("Please enter name").max(100, "Name is too long"),
  email: emailSchema,
  password: passwordSchema,
  termsOfUse: boolean().required().oneOf([true], "Please agree to the terms of use"),
  privacyPolicy: boolean().required().oneOf([true], "Please consent to the privacy policy")
})

export type SignUpFormData = InferType<typeof SignUpSchema>
