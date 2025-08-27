"use client"

import { useSearchParams, useRouter } from "next/navigation"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"

import { useEmailPreferences } from "@/hooks/use-email-preferences"
import type { EmailDomain, EmailType } from "@/lib/email-types"
interface UnsubscribeDialogProps {
  isOpen: boolean
  onDialogClose: () => void
  emailType: string
  emailName: string
  emailTypes: EmailType[]
}

export function UnsubscribeDialog({
  isOpen,
  onDialogClose,
  emailType,
  emailName,
  emailTypes
}: UnsubscribeDialogProps) {
  const { updatePreference, updateService } = useEmailPreferences()
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleConfirmUnsubscribe = () => {
    // Check if this is a service-level unsubscribe
    if (emailType.startsWith("service-")) {
      const domain = emailType.replace("service-", "") as EmailDomain
      updateService({ domain, frequency: "Never", emailTypes })
    } else {
      updatePreference({ id: emailType, frequency: "Never" })
    }
    handleClose()
  }

  const handleClose = () => {
    // Clear search params and close dialog
    const params = new URLSearchParams(searchParams.toString())
    params.delete("unsubscribe")
    router.replace(window.location.pathname + (params.toString() ? `?${params.toString()}` : ""), {
      scroll: false
    })
    onDialogClose()
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={handleClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Unsubscribe from {emailName}?</AlertDialogTitle>
          <AlertDialogDescription>
            You will no longer receive {emailName} emails. You can resubscribe at any time from your
            email preferences.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleConfirmUnsubscribe}>Unsubscribe</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
