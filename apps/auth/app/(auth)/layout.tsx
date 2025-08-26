import HeroSection from "@/components/hero"
import type { ReactNode } from "react"
import * as motion from "motion/react-client"
import { GitHubRepoButton } from "@/components/header/github-repo-button"
import { AnimationWrapper } from "@/components/auth/animation-wrapper"
import { opacityVariant } from "@/animations/opacity"

export default function AuthLayout({
    children
}: Readonly<{
    children: ReactNode
}>) {
    return (
        <>
            <div className="container relative mx-auto grid h-dvh grid-cols-1 flex-col items-center justify-center lg:max-w-none lg:grid-cols-5 lg:px-0">
                <AnimationWrapper>{children}</AnimationWrapper>
                <HeroSection />
            </div>
            <motion.div {...opacityVariant(1)} className="absolute top-0 left-0 m-4">
                <GitHubRepoButton />
            </motion.div>
        </>
    )
}
