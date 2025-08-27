import { opacityVariant } from "@/components/animations/opacity"
import { cn } from "@/lib/utils"
import { motion } from "motion/react"

interface HeadingProps {
  text: string
  description?: string
  className?: string
}

export const Heading = ({ text, description, className }: HeadingProps) => {
  return (
    <div className={cn("my-8 flex flex-col items-center justify-center gap-3 md:my-12", className)}>
      <motion.div
        {...opacityVariant()}
        className="scroll-m-20 text-center font-bold text-3xl tracking-tight md:text-4xl"
      >
        {text}
      </motion.div>
      {description && (
        <motion.p {...opacityVariant()} className="text-center text-muted-foreground">
          {description}
        </motion.p>
      )}
    </div>
  )
}
