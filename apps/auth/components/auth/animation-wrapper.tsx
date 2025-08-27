"use client"
import { containerVariant } from "@repo/shared/animations/auth/auth-forms"
import { AnimatePresence, motion } from "motion/react"
import { usePathname } from "next/navigation"
import { useState } from "react"

export const AnimationWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()

  const [currentPath, setCurrentPath] = useState(pathname)
  const [showChildren, setShowChildren] = useState(children)

  const handleExitComplete = () => {
    // Updating children and pathname once exit animations are done
    setShowChildren(children)
    setCurrentPath(pathname)
  }

  return (
    <div className="p-4 lg:col-span-2 lg:p-8">
      <div className="mx-auto flex w-full flex-col justify-center sm:w-[350px]">
        <AnimatePresence mode="wait" onExitComplete={handleExitComplete}>
          <motion.div
            key={currentPath}
            variants={containerVariant}
            initial="hidden"
            animate="visible"
            className="flex flex-col space-y-2 text-center"
          >
            {showChildren}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
