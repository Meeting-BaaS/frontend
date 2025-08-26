"use client"

import { toast } from "sonner"
import { useEffect, useState } from "react"
import { signIn } from "@/lib/auth-client"
import { motion } from "motion/react"
import { SocialButton } from "@/components/auth/social-button"
import { providers } from "@/components/auth/providers"
import type { ProviderName } from "@/components/auth/providers"
import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { genericError, type errorDescription } from "@/lib/errors"
import { CallbackError } from "@/components/auth/callback-error"
import { itemVariant } from "@/animations/auth/auth-forms"
import { type SignInFormData, SignInSchema } from "@/lib/validators"
import { yupResolver } from "@hookform/resolvers/yup"
import { FormFields } from "@/components/auth/form-fields"
import { Button } from "@/components/ui/button"
import { Loader2, LogIn } from "lucide-react"

export default function SignInForm({
    redirectTo,
    error
}: { redirectTo: string | undefined; error: string | undefined }) {
    const form = useForm<SignInFormData>({
        resolver: yupResolver(SignInSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    })
    const [socialLoading, setSocialLoading] = useState<string | undefined>(undefined)
    const [callbackError, setCallbackError] = useState(error)
    const [isSignInLoading, setIsSignInLoading] = useState(false)

    useEffect(() => setCallbackError(error), [error])
    const loading = Boolean(socialLoading) || isSignInLoading
    const callbackURL = redirectTo || "/home"

    const onProviderSignIn = async (provider: ProviderName) => {
        if (socialLoading) return
        try {
            await signIn.social(
                {
                    provider,
                    callbackURL,
                    errorCallbackURL: "/sign-in"
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

    const onSubmit = async (data: SignInFormData) => {
        setIsSignInLoading(true)
        try {
            await signIn.email(
                {
                    email: data.email,
                    password: data.password,
                    callbackURL
                },
                {
                    onRequest: () => {
                        setCallbackError(undefined)
                    },
                    onResponse: () => {
                        setIsSignInLoading(false)
                    },
                    onError: (ctx) => {
                        if (ctx.error.code === "EMAIL_NOT_VERIFIED") {
                            toast.error(
                                "Email not verified. Please check your email for a verification link."
                            )
                        } else {
                            toast.error(ctx.error.message || genericError)
                        }
                    }
                }
            )
        } catch (error) {
            console.error("Error signing in", error)
            toast.error(genericError)
            setIsSignInLoading(false)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 pt-6">
                <FormFields loading={loading} formType="sign-in" />
                <CallbackError error={callbackError as keyof typeof errorDescription} />
                <motion.div className="flex flex-col gap-3" variants={itemVariant}>
                    <Button
                        type="submit"
                        disabled={loading}
                        aria-label={loading ? "Signing in..." : "Sign in"}
                        aria-busy={isSignInLoading}
                        aria-disabled={isSignInLoading}
                    >
                        {isSignInLoading ? (
                            <>
                                <Loader2 className="animate-spin" />
                                Signing in...
                            </>
                        ) : (
                            <>
                                Sign in
                                <LogIn />
                            </>
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
