import { Button } from "@repo/shared/components/ui/button"
import type { Metadata } from "next"
import Link from "next/link"
import { redirect } from "next/navigation"
import FormWrapper from "@/components/auth/form-wrapper"
import SignInForm from "@/components/auth/sign-in-form"
import type { errorDescription } from "@/lib/errors"

export const metadata: Metadata = {
  title: "Login | Meeting BaaS",
  description: "Login to Meeting BaaS"
}

interface SignInPageProps {
  searchParams: Promise<{
    error: keyof typeof errorDescription | undefined
    redirectTo: string | undefined
  }>
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams
  const { redirectTo, error } = params

  // If the user is trying to sign in with a disabled signup, redirect to the signup page with the error
  if (error === "signup_disabled") {
    const searchParams = new URLSearchParams()
    searchParams.set("error", error)
    if (redirectTo) searchParams.set("redirectTo", redirectTo)
    return redirect(`/sign-up?${searchParams.toString()}`)
  }

  let redirectionHref = "/sign-up"
  if (redirectTo) redirectionHref = `${redirectionHref}?redirectTo=${redirectTo}`

  return (
    <FormWrapper
      key="sign-in"
      title="Welcome Back"
      subtitle="Log in to Meeting BaaS"
      redirectLink={
        <>
          Don&apos;t have an account yet?{" "}
          <Button variant="link" asChild className="h-auto p-0">
            <Link href={redirectionHref}>Sign up</Link>
          </Button>
        </>
      }
    >
      <SignInForm redirectTo={redirectTo} error={error} />
    </FormWrapper>
  )
}
