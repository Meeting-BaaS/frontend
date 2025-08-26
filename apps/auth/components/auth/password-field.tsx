"use client"

import { FormField, FormItem, FormControl, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useFormContext } from "react-hook-form"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import type { FormType } from "@/components/auth/form-fields"

interface PasswordFieldProps {
    loading: boolean
    formType: FormType
    name: "password" | "confirmPassword"
}

export const PasswordField = ({ loading, formType, name }: PasswordFieldProps) => {
    const [showPassword, setShowPassword] = useState(false)
    const form = useFormContext()
    const label = name === "password" ? "Password" : "Confirm password"
    return (
        <FormField
            control={form.control}
            name={name}
            render={({ field }) => (
                <FormItem className="flex flex-col-reverse">
                    <div className="relative grid gap-1">
                        <FormControl>
                            <Input
                                type={showPassword ? "text" : "password"}
                                {...field}
                                disabled={loading}
                                placeholder={label}
                                autoComplete={
                                    formType === "sign-up" ? "new-password" : "current-password"
                                }
                                aria-label={label}
                                className="pr-10"
                            />
                        </FormControl>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-0 right-0 text-muted-foreground"
                            onClick={() => setShowPassword(!showPassword)}
                            disabled={loading}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <EyeOff /> : <Eye />}
                        </Button>

                        <FormMessage />
                    </div>
                    {formType === "sign-in" && (
                        <div className="flex justify-end mt-3">
                            <Button
                                variant="link"
                                disabled={loading}
                                asChild
                                className="h-auto p-0"
                            >
                                <Link href="/forgot-password">Forgot your password?</Link>
                            </Button>
                        </div>
                    )}
                </FormItem>
            )}
        />
    )
}
