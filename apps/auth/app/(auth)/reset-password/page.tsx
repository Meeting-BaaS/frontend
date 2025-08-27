import type { Metadata } from "next"
import FormWrapper from "@/components/auth/form-wrapper"
import ResetPasswordForm from "@/components/auth/reset-password-form"

export const metadata: Metadata = {
  title: "Reset Password | Meeting BaaS",
  description: "Reset Password to Meeting BaaS"
}

export default async function ResetPasswordPage({
  searchParams
}: {
  searchParams: Promise<{ token: string | undefined }>
}) {
  const params = await searchParams
  const { token } = params

  return (
    <FormWrapper
      key="reset-password"
      title="Reset Password"
      subtitle="Please enter your new password."
    >
      <ResetPasswordForm token={token} />
    </FormWrapper>
  )
}
