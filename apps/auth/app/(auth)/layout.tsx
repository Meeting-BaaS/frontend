import { opacityVariant } from "@repo/shared/animations/opacity"
import * as motion from "motion/react-client"
import type { ReactNode } from "react"
import { AnimationWrapper } from "@/components/auth/animation-wrapper"
import { AccessV2Button } from "@/components/header/access-v2-button"
import HeroSection from "@/components/hero"

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
        <AccessV2Button />
      </motion.div>
    </>
  )
}
