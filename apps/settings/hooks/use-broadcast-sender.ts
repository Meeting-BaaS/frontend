import { useState } from "react"
import { toast } from "sonner"
import { sendBroadcast } from "@/lib/api/broadcast-api"
import type { Content, Recipient } from "@/lib/broadcast-types"
import type { EmailFrequency, EmailType } from "@/lib/email-types"

const BATCH_SIZE = Number(process.env.NEXT_PUBLIC_EMAIL_BATCH_SIZE) || 100

interface UseBroadcastSenderProps {
  emailId: EmailType["id"]
  frequency: EmailFrequency
  selectedContent: Content["id"][]
  subject: string
}

interface BroadcastProgress {
  current: number
  total: number
}

interface BroadcastResult {
  successCount: number
  errorRecipients: Recipient[]
}

export function useBroadcastSender({
  emailId,
  frequency,
  selectedContent,
  subject
}: UseBroadcastSenderProps) {
  const [isSending, setIsSending] = useState(false)
  const [progress, setProgress] = useState<BroadcastProgress>({ current: 0, total: 0 })
  const [result, setResult] = useState<BroadcastResult>({ successCount: 0, errorRecipients: [] })

  const sendBroadcastToRecipients = async (
    recipients: Recipient[]
  ): Promise<BroadcastResult | null> => {
    if (recipients.length === 0 || isSending) return null

    setIsSending(true)
    const batches = Math.ceil(recipients.length / BATCH_SIZE)
    setProgress({ current: 0, total: recipients.length })
    setResult({ successCount: 0, errorRecipients: [] })

    try {
      let currentSuccessCount = 0
      const currentErrorRecipients: Recipient[] = []

      for (let i = 0; i < batches; i++) {
        const start = i * BATCH_SIZE
        const end = Math.min(start + BATCH_SIZE, recipients.length)
        const batchRecipients = recipients.slice(start, end)
        let successesInBatch = 0

        try {
          await sendBroadcast({
            emailId,
            contentIds: selectedContent,
            recipients: batchRecipients,
            frequency,
            subject
          })
          successesInBatch = batchRecipients.length
        } catch (_error) {
          console.error("Failed to send broadcast batch", _error)
          currentErrorRecipients.push(...batchRecipients)
        }

        currentSuccessCount += successesInBatch
        setProgress((prev) => ({ ...prev, current: prev.current + successesInBatch }))
      }

      setResult({
        successCount: currentSuccessCount,
        errorRecipients: currentErrorRecipients
      })

      return {
        successCount: currentSuccessCount,
        errorRecipients: currentErrorRecipients
      }
    } catch (error) {
      console.error("Failed to send broadcast", error)
      toast.error("Failed to send broadcast")
      return null
    } finally {
      setIsSending(false)
    }
  }

  const sendTestEmail = async (recipient: Recipient) => {
    try {
      await sendBroadcast({
        emailId,
        contentIds: selectedContent,
        recipients: [recipient],
        frequency,
        subject
      })
      toast.success("Test email sent successfully")
      return true
    } catch (error) {
      console.error("Failed to send test email", error)
      toast.error("Failed to send test email")
      return false
    }
  }

  return {
    isSending,
    progress,
    result,
    sendBroadcastToRecipients,
    sendTestEmail
  }
}
