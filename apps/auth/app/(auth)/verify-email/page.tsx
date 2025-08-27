import { Button } from "@repo/shared/components/ui/button"
import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Verify email | Meeting BaaS",
  description: "Verify email"
}

export default async function VerifyEmailPage({
  searchParams
}: {
  searchParams: Promise<{ email: string | undefined }>
}) {
  const params = await searchParams
  const { email } = params

  return (
    <>
      <h1 className="font-semibold text-2xl tracking-tight">Verify your email</h1>
      <p className="text-muted-foreground text-sm">
        We&apos;ve sent a verification email to{" "}
        <span className="font-bold">{email || "your email"}</span>. Please check your inbox and
        click the link to verify your email.
      </p>
      <Button variant="link" asChild>
        <Link href="/sign-in">Go back to Log in</Link>
      </Button>
    </>
  )
}
