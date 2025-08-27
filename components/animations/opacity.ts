export const opacityVariant = (delay = 0) => ({
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true },
  transition: {
    delay,
    ease: "easeInOut",
    duration: 0.25
  }
})
