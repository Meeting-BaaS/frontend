"use client"

import { toast } from "sonner"
import { useState } from "react"
import { resetPassword } from "@/lib/auth-client"
import { motion } from "motion/react"
import { useForm } from "react-hook-form"
import { Form } from "@/components/ui/form"
import { genericError } from "@/lib/errors"
import { itemVariant } from "@/animations/auth/auth-forms"
import { yupResolver } from "@hookform/resolvers/yup"
import { FormFields } from "@/components/auth/form-fields"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { type ResetPasswordFormData, ResetPasswordSchema } from "@/lib/validators"
import { useRouter } from "next/navigation"

interface ResetPasswordFormProps {
    token: string | undefined
}

export default function ResetPasswordForm({ token }: ResetPasswordFormProps) {
    const router = useRouter()
    const form = useForm<ResetPasswordFormData>({
        resolver: yupResolver(ResetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: ""
        }
    })
    const [isResetPasswordLoading, setIsResetPasswordLoading] = useState(false)

    if (!token) {
        // Error boundary will handle this
        throw new Error(
            "Invalid reset password token. Please request to reset your password again."
        )
    }

    const onSubmit = async (data: ResetPasswordFormData) => {
        if (isResetPasswordLoading) return
        try {
            await resetPassword(
                {
                    newPassword: data.password,
                    token: token
                },
                {
                    onRequest: (_ctx) => {
                        setIsResetPasswordLoading(true)
                    },
                    onResponse: (_ctx) => {
                        setIsResetPasswordLoading(false)
                    },
                    onSuccess: () => {
                        router.push("/sign-in")
                        toast.success(
                            "Password reset successfully. Please sign in with your new password."
                        )
                    },
                    onError: (ctx) => {
                        toast.error(ctx.error.message || genericError)
                    }
                }
            )
        } catch (error) {
            console.error("Error resetting password", error)
            setIsResetPasswordLoading(false)
            toast.error(genericError)
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 pt-6">
                <FormFields loading={isResetPasswordLoading} formType="reset-password" />
                <motion.div className="flex flex-col gap-3" variants={itemVariant}>
                    <Button
                        type="submit"
                        disabled={isResetPasswordLoading}
                        aria-label={
                            isResetPasswordLoading ? "Resetting password..." : "Reset password"
                        }
                        aria-busy={isResetPasswordLoading}
                        aria-disabled={isResetPasswordLoading}
                    >
                        {isResetPasswordLoading ? (
                            <>
                                <Loader2 className="animate-spin" />
                                Resetting password...
                            </>
                        ) : (
                            <>Reset password</>
                        )}
                    </Button>
                </motion.div>
            </form>
        </Form>
    )
}
