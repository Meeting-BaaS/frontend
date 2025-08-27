import type { Variants } from "motion/react"

export const containerVariants: Variants = {
  initial: { opacity: 0, y: 10, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -10, scale: 0.95 }
}

export const containerTransition = {
  duration: 0.15,
  type: "spring",
  stiffness: 400,
  damping: 25
}

export const allLogsButtonVariants: Variants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
}

export const allLogsButtonTransition = {
  duration: 0.15
}

export const childrenVariants: Variants = {
  initial: { opacity: 0, x: -2 },
  animate: (custom: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: custom * 0.025,
      duration: 0.15
    }
  }),
  exit: { opacity: 0, x: 2 }
}
