import type { MotionProps } from "motion/react"

export const cardContainerVariant = (visibleY: string, delay: number): MotionProps["variants"] => ({
    hidden: { y: "100%" },
    visible: {
        y: visibleY,
        transition: {
            delay,
            duration: 1.2,
            ease: [0.65, 0, 0.35, 1],
            when: "beforeChildren",
            staggerChildren: 0.15
        }
    }
})

export const cardItemVariant = (opacity = 1): MotionProps["variants"] => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity,
        y: 0,
        transition: {
            duration: 0.75
        }
    }
})
