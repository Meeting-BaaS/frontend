import type { MotionProps } from "motion/react"

export const containerVariant: MotionProps["variants"] = {
    hidden: { opacity: 0, y: "5%" },
    visible: {
        opacity: 1,
        y: "0%",
        transition: {
            type: "spring",
            ease: "easeIn",
            stiffness: 80,
            damping: 20,
            duration: 1.5,
            delay: 0.5,
            staggerChildren: 0.15
        }
    }
}

export const itemVariant = {
    hidden: { opacity: 0, y: 5 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.25
        }
    }
}

export const formMessageAnimation: MotionProps = {
    initial: { opacity: 0, y: -10, height: 0 },
    animate: { opacity: 1, y: 0, height: "auto" },
    exit: { opacity: 0, y: -10, height: 0 },
    transition: {
        duration: 0.2,
        ease: "easeOut"
    }
}
