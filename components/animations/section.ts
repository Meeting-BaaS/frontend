export const sectionVariant = (delay = 0) => ({
  initial: { opacity: 0, y: "2%" },
  whileInView: { opacity: 1, y: "0%" },
  viewport: { once: true },
  transition: {
    type: "spring",
    ease: "easeIn",
    stiffness: 80,
    damping: 20,
    duration: 0.25,
    delay: delay
  }
})
