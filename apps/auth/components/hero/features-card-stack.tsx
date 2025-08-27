"use client"

import { cardContainerVariant, cardItemVariant } from "@repo/shared/animations/auth/auth-card-stacks"
import { Code } from "lucide-react"
import { motion } from "motion/react"
import Image from "next/image"

const MotionImage = motion.create(Image)

export const FeaturesCardStack = () => {
  return (
    <>
      <motion.div
        variants={cardContainerVariant("0%", 0.5)}
        initial="hidden"
        animate="visible"
        className="flex h-full w-full flex-col justify-between gap-3 rounded-2xl bg-primary p-4 text-primary-foreground"
      >
        <div>
          <motion.div variants={cardItemVariant()} className="font-semibold text-xl">
            Maximum Customisation
          </motion.div>
          <motion.div variants={cardItemVariant()} className="text-sm opacity-80">
            Built for developers, structured for open source contributions and easy self hosting
          </motion.div>
        </div>
        <motion.div variants={cardItemVariant()} className="flex justify-end">
          <Code className="h-10 w-10 rounded-full bg-white/20 p-2 backdrop-blur-md" />
        </motion.div>
      </motion.div>
      <motion.div
        variants={cardContainerVariant("-100%", 6)} // Delay intentionally longer to allow user to read the first card
        initial="hidden"
        animate="visible"
        className="flex h-full w-full flex-col justify-between gap-3 rounded-2xl bg-primary p-4 text-primary-foreground"
      >
        <MotionImage
          src="/search-snippet.png"
          alt="Search box snippet"
          width={250}
          height={150}
          variants={cardItemVariant()}
          className="w-full"
          priority
        />

        <motion.div variants={cardItemVariant()}>
          <div className="font-medium text-xl">Detailed Documentation</div>
          <div className="text-primary-foreground text-sm opacity-80">
            Easily integrate with APIs and SDKs using our extensive docs
          </div>
        </motion.div>
      </motion.div>
    </>
  )
}
