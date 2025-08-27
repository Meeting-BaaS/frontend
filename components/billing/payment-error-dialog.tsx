"use client"

import { XCircle } from "lucide-react"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"

interface PaymentErrorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PaymentErrorDialog({ open, onOpenChange }: PaymentErrorDialogProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Remove payment parameter from URL when dialog is closed
      const newParams = new URLSearchParams(searchParams)
      newParams.delete("payment")
      router.replace(`?${newParams.toString()}`, { scroll: false })
    }
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <XCircle className="size-5 stroke-destructive" />
            <DialogTitle>Payment Failed</DialogTitle>
          </div>
          <DialogDescription>Your payment was cancelled. Please try again.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button size="sm">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
