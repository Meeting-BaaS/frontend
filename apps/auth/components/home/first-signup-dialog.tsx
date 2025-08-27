import { Button } from "@repo/shared/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@repo/shared/components/ui/dialog"
import { Fish } from "lucide-react"
import { getChatUrl } from "@/lib/utils"

interface FirstSignupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  chatId: string | null
}

export function FirstSignupDialog({ open, onOpenChange, chatId }: FirstSignupDialogProps) {
  const handleStartChat = () => {
    window.open(getChatUrl(chatId), "_blank")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Fish /> Welcome to Meeting BaaS!
          </DialogTitle>
          <DialogDescription>
            {chatId ? (
              <>
                We have created a chat for you to get you started with Meeting BaaS.
                <br /> It can help you understand how to make the most of Meeting BaaS.
              </>
            ) : (
              "Would you like to have a quick chat with our AI assistant? It can help you understand how to make the most of Meeting BaaS and get you started on the right track."
            )}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex flex-col gap-2 sm:flex-row sm:justify-end">
          <DialogClose asChild>
            <Button variant="outline">I'll explore on my own</Button>
          </DialogClose>
          <Button onClick={handleStartChat}>Continue to Chat</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
