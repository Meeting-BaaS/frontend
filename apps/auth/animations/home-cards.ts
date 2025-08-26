export const homeCardsVariant = {
    initial: { opacity: 0, y: "2%" },
    animate: { opacity: 1, y: "0%" },
    transition: {
        type: "spring",
        ease: "easeIn",
        stiffness: 80,
        damping: 20,
        duration: 0.25,
        delay: 0.25
    }
}
