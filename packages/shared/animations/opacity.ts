import type { MotionProps } from "motion/react"

export const opacityVariant = (delay = 0): MotionProps => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: {
    delay,
    ease: "easeInOut",
    duration: 0.25
  }
})
