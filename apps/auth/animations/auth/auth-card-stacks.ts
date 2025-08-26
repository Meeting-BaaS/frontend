export const cardContainerVariant = (visibleY: string, delay: number) => ({
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

export const cardItemVariant = (opacity = 1) => ({
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity,
        y: 0,
        transition: {
            duration: 0.75
        }
    }
})
