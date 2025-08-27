"use client"

import { itemVariant } from "@repo/shared/animations/auth/auth-forms"
import { motion } from "motion/react"
import Image from "next/image"
import type { ReactNode } from "react"

interface FormWrapperProps {
    title?: string
    subtitle?: string
    redirectLink?: ReactNode
    children: ReactNode
}

export default function FormWrapper({ title, subtitle, redirectLink, children }: FormWrapperProps) {
    return (
        <>
            <motion.div variants={itemVariant} className="flex items-center justify-center gap-2">
                <Image
                    src="/logo.svg"
                    alt="Meeting BaaS logo"
                    priority
                    width={30}
                    height={30}
                    className="h-9 w-9"
                    onError={(e) => {
                        // Upon error, don't display image
                        e.currentTarget.style.display = "none"
                    }}
                />
            </motion.div>
            <motion.h1 variants={itemVariant} className="font-semibold text-2xl tracking-tight">
                {title || "Welcome"}
            </motion.h1>
            <motion.p variants={itemVariant} className="text-muted-foreground text-sm">
                {subtitle || "Unlock all the features of Meeting BaaS"}
            </motion.p>
            {children}
            {redirectLink && (
                <motion.div
                    className="pt-2 text-left text-muted-foreground text-sm"
                    variants={itemVariant}
                >
                    {redirectLink}
                </motion.div>
            )}
        </>
    )
}
