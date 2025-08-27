"use client"

import { yupResolver } from "@hookform/resolvers/yup"
import { itemVariant } from "@repo/shared/animations/auth/auth-forms"
import { Button } from "@repo/shared/components/ui/button"
import { Form } from "@repo/shared/components/ui/form"
import { Loader2 } from "lucide-react"
import { motion } from "motion/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { CallbackError } from "@/components/auth/callback-error"
import { FormFields } from "@/components/auth/form-fields"
import type { ProviderName } from "@/components/auth/providers"
import { providers } from "@/components/auth/providers"
import { SocialButton } from "@/components/auth/social-button"
import { signIn, signUp } from "@/lib/auth-client"
import { type errorDescription, genericError } from "@/lib/errors"
import { type SignUpFormData, SignUpSchema } from "@/lib/validators"

export default function SignUpForm({
  redirectTo,
  error
}: {
  redirectTo: string | undefined
  error: string | undefined
}) {
  const form = useForm<SignUpFormData>({
    resolver: yupResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      termsOfUse: false,
      privacyPolicy: false
    }
  })
  const router = useRouter()
  const [socialLoading, setSocialLoading] = useState<string | undefined>(undefined)
  const [callbackError, setCallbackError] = useState(error)
  const [providerButtonClicked, setProviderButtonClicked] = useState(false)
  const [isSignUpLoading, setIsSignUpLoading] = useState(false)

  const loading = Boolean(socialLoading) || isSignUpLoading
  const callbackURL = redirectTo || "/home"
  const { watch, trigger } = form
  const termsOfUse = watch("termsOfUse")
  const privacyPolicy = watch("privacyPolicy")

  useEffect(() => setCallbackError(error), [error])

  useEffect(() => {
    if (providerButtonClicked) {
      trigger("termsOfUse")
      trigger("privacyPolicy")
    }
  }, [termsOfUse, privacyPolicy, providerButtonClicked, trigger])

  const onProviderSignIn = async (provider: ProviderName) => {
    if (socialLoading) return
    setProviderButtonClicked(true)

    // Validate only terms and privacy policy for social sign-up
    form.clearErrors()
    const values = form.getValues()

    const termsSchema = SignUpSchema.pick(["termsOfUse"])
    const privacySchema = SignUpSchema.pick(["privacyPolicy"])

    const termsValid = termsSchema.isValidSync(values)
    const privacyValid = privacySchema.isValidSync(values)

    if (!termsValid) {
      trigger("termsOfUse")
    }
    if (!privacyValid) {
      trigger("privacyPolicy")
    }

    if (!termsValid || !privacyValid) {
      return
    }

    try {
      await signIn.social(
        {
          provider,
          callbackURL,
          errorCallbackURL: "/sign-up",
          requestSignUp: true
        },
        {
          onRequest: (_ctx) => {
            setSocialLoading(provider)
            setCallbackError(undefined)
          },
          onResponse: (_ctx) => {
            setSocialLoading(undefined)
          },
          onError: (ctx) => {
            toast.error(ctx.error.message || genericError)
          }
        }
      )
    } catch (error) {
      console.error("Error signing in with provider", error, provider)
      setSocialLoading(undefined)
      toast.error(genericError)
    }
  }

  const onSubmit = async (data: SignUpFormData) => {
    setIsSignUpLoading(true)
    try {
      await signUp.email(
        {
          email: data.email,
          name: data.name,
          password: data.password,
          callbackURL
        },
        {
          onRequest: () => {
            setCallbackError(undefined)
          },
          onResponse: () => {
            setIsSignUpLoading(false)
          },
          onSuccess: () => {
            const searchParams = new URLSearchParams()
            searchParams.set("email", data.email)
            router.push(`/verify-email?${searchParams.toString()}`)
          },
          onError: (ctx) => {
            console.log(ctx.error)
            toast.error(ctx.error.message || genericError)
          }
        }
      )
    } catch (error) {
      console.error("Error creating account", error)
      toast.error(genericError)
      setIsSignUpLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 pt-6" noValidate>
        <FormFields loading={loading} formType="sign-up" />
        <CallbackError error={callbackError as keyof typeof errorDescription} />
        <motion.div className="flex flex-col gap-3" variants={itemVariant}>
          <Button
            type="submit"
            disabled={loading}
            aria-label={loading ? "Creating account..." : "Create an account"}
            aria-busy={isSignUpLoading}
            aria-disabled={isSignUpLoading}
          >
            {isSignUpLoading ? (
              <>
                <Loader2 className="animate-spin" />
                Creating account...
              </>
            ) : (
              "Create an account"
            )}
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>
          {providers.length > 0 && (
            <div className="flex gap-2">
              {providers.map((provider) => (
                <SocialButton
                  key={provider.name}
                  {...provider}
                  loading={loading}
                  socialLoading={socialLoading}
                  type="button"
                  onClick={() => onProviderSignIn(provider.name)}
                />
              ))}
            </div>
          )}
        </motion.div>
      </form>
    </Form>
  )
}
