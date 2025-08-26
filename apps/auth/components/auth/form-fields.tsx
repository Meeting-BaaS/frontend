"use client"

import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { TERMS_AND_CONDITIONS_URL, PRIVACY_POLICY_URL } from "@/lib/external-urls"
import { motion } from "motion/react"
import { itemVariant } from "@/animations/auth/auth-forms"
import { useFormContext } from "react-hook-form"
import Link from "next/link"
import { PasswordField } from "@/components/auth/password-field"
import { cn } from "@/lib/utils"

export type FormType = "sign-in" | "sign-up" | "forgot-password" | "reset-password"

interface FormFieldsProps {
    loading: boolean
    formType: FormType
}

export const FormFields = ({ loading, formType }: FormFieldsProps) => {
    const form = useFormContext()
    return (
        <>
            <motion.div className="flex flex-col gap-3 text-left" variants={itemVariant}>
                {formType === "sign-up" && (
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        {...field}
                                        disabled={loading}
                                        placeholder="Name"
                                        autoComplete="name"
                                        aria-label="Name"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem className={cn(formType === "reset-password" && "hidden")}>
                            <FormControl>
                                <Input
                                    type="email"
                                    {...field}
                                    value={field.value || ""} // Undefined for reset password form
                                    disabled={loading}
                                    placeholder="Email"
                                    autoComplete="email"
                                    aria-label="Email"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {["sign-in", "sign-up", "reset-password"].includes(formType) && (
                    <PasswordField loading={loading} formType={formType} name="password" />
                )}
                {formType === "reset-password" && (
                    <PasswordField loading={loading} formType={formType} name="confirmPassword" />
                )}
            </motion.div>
            {formType === "sign-up" && (
                <motion.div className="flex flex-col gap-3" variants={itemVariant}>
                    <FormField
                        control={form.control}
                        name="termsOfUse"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-1">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={loading}
                                    />
                                </FormControl>
                                <FormLabel className="flex-wrap gap-1">
                                    I agree
                                    <Button
                                        variant="link"
                                        asChild
                                        className="h-auto p-0 text-inherit underline transition-none hover:text-primary"
                                    >
                                        <Link
                                            href={TERMS_AND_CONDITIONS_URL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            to the terms of use of Meeting BaaS
                                        </Link>
                                    </Button>
                                </FormLabel>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="privacyPolicy"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-1">
                                <FormControl>
                                    <Checkbox
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        disabled={loading}
                                    />
                                </FormControl>
                                <FormLabel className="flex-wrap gap-1">
                                    I consent
                                    <Button
                                        variant="link"
                                        asChild
                                        className="h-auto p-0 text-inherit underline transition-none hover:text-primary"
                                    >
                                        <Link
                                            href={PRIVACY_POLICY_URL}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            to the privacy policy of Meeting BaaS
                                        </Link>
                                    </Button>
                                </FormLabel>
                            </FormItem>
                        )}
                    />
                </motion.div>
            )}
        </>
    )
}
