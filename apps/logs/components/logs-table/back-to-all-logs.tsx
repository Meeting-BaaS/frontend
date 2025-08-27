import { Button } from "@repo/shared/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { usePostMessage } from "@/hooks/use-post-message"

const MotionButton = motion.create(Button)

interface BackToAllLogsProps {
  botUuids: string[]
  setBotUuids: (botUuids: string[]) => void
}

export const BackToAllLogs = ({ botUuids, setBotUuids }: BackToAllLogsProps) => {
  const { botUuids: postMessageBotUuids, setBotUuids: setPostMessageBotUuids } = usePostMessage()

  const handleBackToAllLogs = () => {
    setBotUuids([])
    setPostMessageBotUuids([])
  }

  return (
    <AnimatePresence mode="wait">
      {(botUuids.length > 0 || postMessageBotUuids.length > 0) && (
        <MotionButton
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          variant="outline"
          onClick={handleBackToAllLogs}
        >
          <ArrowLeft />
          Back to all logs
        </MotionButton>
      )}
    </AnimatePresence>
  )
}
