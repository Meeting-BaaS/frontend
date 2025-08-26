export const opacityVariant = (delay = 0) => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: {
        delay,
        ease: "easeInOut",
        duration: 0.25
    }
})
