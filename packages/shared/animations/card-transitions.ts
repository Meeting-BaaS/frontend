const TRANSITION_DURATION = 0.5
const TRANSITION_EASE = [0.4, 0, 0.2, 1] as const

export const homeCardsVariants = (reduceMotion: boolean) => ({
    initial: {
        opacity: 0,
        x: reduceMotion ? 0 : "-5%"
    },
    animate: {
        opacity: 1,
        x: 0,
        transition: {
            duration: TRANSITION_DURATION,
            ease: TRANSITION_EASE
        }
    },
    exit: {
        opacity: 0,
        x: reduceMotion ? 0 : "-5%",
        transition: {
            duration: TRANSITION_DURATION,
            ease: TRANSITION_EASE
        }
    }
})

export const subCardsVariants = (reduceMotion: boolean) => ({
    initial: {
        opacity: 0,
        x: reduceMotion ? 0 : "5%"
    },
    animate: {
        opacity: 1,
        x: 0,
        transition: {
            duration: TRANSITION_DURATION,
            ease: TRANSITION_EASE
        }
    },
    exit: {
        opacity: 0,
        x: reduceMotion ? 0 : "5%",
        transition: {
            duration: TRANSITION_DURATION,
            ease: TRANSITION_EASE
        }
    }
})
