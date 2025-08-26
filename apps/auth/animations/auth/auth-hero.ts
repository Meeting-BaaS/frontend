export const authHeroVariant = {
    initial: { opacity: 0, y: "-5%" },
    animate: { opacity: 1, y: "0%" },
    transition: {
        type: "spring",
        ease: "easeIn",
        stiffness: 80,
        damping: 20,
        duration: 1.5,
        delay: 0.5
    }
}
