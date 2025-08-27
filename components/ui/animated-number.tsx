import { formatNumber } from "@/lib/utils"
import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"

export function AnimatedNumber({ value }: { value: number }) {
    const formattedValue = formatNumber(value)
    const [prevValue, setPrevValue] = useState(value)
    const isIncreasing = value > prevValue
  
    useEffect(() => {
      setPrevValue(value)
    }, [value])
  
    return (
      <div className="flex">
        {formattedValue.split("").map((char, index) => (
          <motion.span
            key={`${char}-${index}`}
            initial={{ opacity: 0, y: isIncreasing ? 10 : -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.15,
              delay: index * 0.1,
              ease: [0.16, 1, 0.3, 1]
            }}
            className="inline-block"
          >
            {char}
          </motion.span>
        ))}
      </div>
    )
  }
  