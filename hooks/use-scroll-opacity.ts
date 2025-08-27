import { useState, useEffect } from "react"

export function useScrollOpacity(initialOpacity = 1, scrolledOpacity = 0.5, debounceMs = 150) {
  const [opacity, setOpacity] = useState(initialOpacity)

  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout

    const handleScroll = () => {
      setOpacity(scrolledOpacity)
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(() => {
        setOpacity(initialOpacity)
      }, debounceMs)
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [initialOpacity, scrolledOpacity, debounceMs])

  return opacity
}
