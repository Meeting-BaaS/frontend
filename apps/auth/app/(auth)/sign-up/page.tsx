import { Button } from "@repo/shared/components/ui/button"
import type { Metadata } from "next"
import Link from "next/link"
import FormWrapper from "@/components/auth/form-wrapper"
import SignUpForm from "@/components/auth/sign-up-form"

export const metadata: Metadata = {
  title: "Sign up | Meeting BaaS",
  description: "Sign up to Meeting BaaS"
}

export default async function SignUpPage({
  searchParams
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams
  const { redirectTo, error } = params

  let redirectionHref = "/sign-in"
  if (redirectTo) redirectionHref = `${redirectionHref}?redirectTo=${redirectTo}`

  return (
    <FormWrapper
      key="sign-up"
      redirectLink={
        <>
          Already have an account?{" "}
          <Button variant="link" asChild className="h-auto p-0">
            <Link href={redirectionHref}>Log in</Link>
          </Button>
        </>
      }
    >
      <SignUpForm redirectTo={redirectTo} error={error} />
    </FormWrapper>
  )
}
