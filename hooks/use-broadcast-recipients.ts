import { useState, useEffect, useCallback } from "react"
import { getRecipients } from "@/lib/api/broadcast-api"
import type { Recipient, RecipientParams } from "@/lib/broadcast-types"
import type { EmailFrequency, EmailId } from "@/lib/email-types"
import { toast } from "sonner"

interface UseBroadcastRecipientsProps {
  emailId: string
  frequency: EmailFrequency
  botCountLessThan?: string
  lastBotMoreThanDays?: string
  isOpen: boolean
}

export function useBroadcastRecipients({
  emailId,
  frequency,
  botCountLessThan,
  lastBotMoreThanDays,
  isOpen
}: UseBroadcastRecipientsProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [recipients, setRecipients] = useState<Recipient[]>([])

  const fetchRecipients = useCallback(async () => {
    setIsLoading(true)
    try {
      const params: RecipientParams = {
        emailId: emailId as EmailId,
        frequency,
        botCountLessThan,
        lastBotMoreThanDays
      }
      const data = await getRecipients(params)
      if (isOpen) setRecipients(data)
    } catch (error) {
      console.error("Failed to fetch recipients", error)
      toast.error("Failed to fetch recipients")
    } finally {
      setIsLoading(false)
    }
  }, [emailId, frequency, botCountLessThan, lastBotMoreThanDays, isOpen])

  useEffect(() => {
    if (isOpen) {
      fetchRecipients()
    } else {
      setRecipients([])
    }
  }, [isOpen, fetchRecipients])

  return {
    isLoading,
    recipients
  }
}
