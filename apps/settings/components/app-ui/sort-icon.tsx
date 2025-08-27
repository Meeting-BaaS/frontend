import type { SortDirection } from "@tanstack/react-table"
import { ArrowDown10, ArrowDownZA, ArrowUp01, ArrowUpAZ, ArrowUpDown } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"

export const SortIcon = ({
  isSorted,
  isNumber
}: {
  isSorted: false | SortDirection
  isNumber?: boolean
}) => {
  const upIcon = isNumber ? <ArrowUp01 /> : <ArrowUpAZ />
  const downIcon = isNumber ? <ArrowDown10 /> : <ArrowDownZA />

  const renderIcon = () => {
    if (isSorted) {
      return isSorted === "asc" ? upIcon : downIcon
    }
    return <ArrowUpDown />
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={String(isSorted)}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -5 }}
        transition={{
          ease: "easeInOut",
          duration: 0.2
        }}
      >
        {renderIcon()}
      </motion.div>
    </AnimatePresence>
  )
}
