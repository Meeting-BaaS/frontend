"use client"

import { zodResolver } from "@hookform/resolvers/zod"
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
import { Form } from "@repo/shared/components/ui/form"
import { useSession } from "@repo/shared/hooks/use-session"
import { Loader2 } from "lucide-react"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { BroadcastStatus } from "@/components/broadcasts/broadcast-status"
import { NoRecipientsAlert } from "@/components/broadcasts/no-recipients-alert"
import { RecipientFormFields } from "@/components/broadcasts/recipient-form-fields"
import { useBroadcastRecipients } from "@/hooks/use-broadcast-recipients"
import { useBroadcastSender } from "@/hooks/use-broadcast-sender"
import type { Content, RecipientWithStatus } from "@/lib/broadcast-types"
import type { EmailFrequency, EmailType } from "@/lib/email-types"
import { downloadCsv, parseCsv } from "@/lib/parse-csv"
import type { BroadcastFormValues } from "@/lib/schemas/broadcast"
import {
  type CsvRows,
  csvFileSchema,
  type RecipientFormValues,
  recipientFormSchema
} from "@/lib/schemas/recipients"

interface SendToSelectedRecipientsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  broadcastFormValues: BroadcastFormValues
  broadcastTypes: EmailType[]
  selectedContent: Content["id"][]
}

export function SendToSelectedRecipientsDialog({
  open,
  onOpenChange,
  broadcastFormValues,
  broadcastTypes,
  selectedContent
}: SendToSelectedRecipientsDialogProps) {
  const session = useSession()
  const [showResults, setShowResults] = useState(false)
  const [recipientStatuses, setRecipientStatuses] = useState<RecipientWithStatus[]>([])
  const [csvRows, setCsvRows] = useState<Map<string, CsvRows[number]> | null>(null)
  const [csvParsing, setCsvParsing] = useState(false)
  const [csvError, setCsvError] = useState<string | null>(null)
  const [isTestEmailLoading, setIsTestEmailLoading] = useState(false)

  const form = useForm<RecipientFormValues>({
    resolver: zodResolver(recipientFormSchema),
    defaultValues: {
      maxRecipients: "",
      csvFile: null
    }
  })

  const {
    formState: { isDirty },
    watch
  } = form

  const {
    emailType: emailId,
    frequency,
    subject,
    botCountLessThan,
    lastBotMoreThanDays
  } = broadcastFormValues

  const { isLoading: isLoadingRecipients, recipients } = useBroadcastRecipients({
    emailId,
    frequency: frequency as EmailFrequency,
    botCountLessThan,
    lastBotMoreThanDays,
    isOpen: open
  })

  const { isSending, progress, result, sendBroadcastToRecipients, sendTestEmail } =
    useBroadcastSender({
      emailId: emailId as EmailType["id"],
      frequency: frequency as EmailFrequency,
      selectedContent,
      subject: subject ?? ""
    })

  useEffect(() => {
    if (!open) {
      setShowResults(false)
      setRecipientStatuses([])
      form.reset()
      setCsvError(null)
    }
  }, [open, form.reset])

  const csvFile = watch("csvFile")

  const handleCsvParsing = useCallback(async (file: File) => {
    setCsvParsing(true)
    setCsvError(null)
    setCsvRows(null)

    try {
      const csvRows = await parseCsv(file)
      setCsvRows(csvRows)
    } catch (error) {
      setCsvError(error instanceof Error ? error.message : "Failed to parse CSV file")
      setCsvRows(null)
    } finally {
      setCsvParsing(false)
    }
  }, [])

  useEffect(() => {
    if (csvFile) {
      const parsedFile = csvFileSchema.safeParse(csvFile)
      // Form will take care of the error scenario
      if (parsedFile.success) {
        handleCsvParsing(csvFile)
      }
    } else {
      setCsvError(null)
      setCsvRows(null)
    }
  }, [csvFile, handleCsvParsing])

  const disableSubmit = useMemo(
    () => !isDirty || isSending || csvParsing || recipients.length === 0,
    [isDirty, isSending, csvParsing, recipients.length]
  )

  const handleSend = async (values: RecipientFormValues) => {
    if (isSending) return

    const { maxRecipients, csvFile } = values
    const maxRecipientsCount = Number(maxRecipients)

    // Build a set of emails that were already sent (from CSV)
    const alreadySent = new Set<string>()
    if (csvFile && csvRows) {
      for (const [email, row] of csvRows.entries()) {
        if (row.status === "sent") {
          alreadySent.add(email)
        }
      }
    }

    // Pick up to maxRecipients from those not already sent
    const recipientsToSend = recipients
      .filter((r) => !alreadySent.has(r.email))
      .slice(0, maxRecipientsCount)

    if (recipientsToSend.length === 0) {
      toast.error(
        "No recipients found. Either all recipients have been sent or they may have unsubscribed."
      )
      return
    }

    // Send the broadcast to the recipients
    const sendResult = await sendBroadcastToRecipients(recipientsToSend)
    if (!sendResult) {
      // Hook will handle the error
      return
    }
    const errorSet = new Set(sendResult.errorRecipients.map((r) => r.email))

    // Build the updated statuses for all recipients
    const updatedStatuses: RecipientWithStatus[] = recipients.map((recipient) => {
      if (alreadySent.has(recipient.email)) {
        return {
          ...recipient,
          status: "sent"
        }
      }
      if (recipientsToSend.find((r) => r.email === recipient.email)) {
        return {
          ...recipient,
          status: errorSet.has(recipient.email) ? "error" : "sent"
        }
      }
      return {
        ...recipient,
        status: "skipped"
      }
    })

    setRecipientStatuses(updatedStatuses)
    downloadCsv({
      recipientStatuses: updatedStatuses,
      broadcastId: broadcastFormValues.emailType,
      filename: csvFile?.name
    })
    setShowResults(true)
  }

  const handleTestEmail = async () => {
    if (!session || isTestEmailLoading) return
    const recipient = {
      email: session.user.email,
      firstname: session.user.firstname ?? "",
      lastname: session.user.lastname ?? ""
    }
    setIsTestEmailLoading(true)
    await sendTestEmail(recipient)
    setIsTestEmailLoading(false)
  }

  const handleOpenChange = (open: boolean) => {
    if (isSending) return
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent hideCloseButton={isSending}>
        <DialogHeader>
          <DialogTitle>Send to Selected Recipients</DialogTitle>
          <DialogDescription className="sr-only">
            Send {broadcastTypes.find((type) => type.id === emailId)?.name} to selected recipients
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {isLoadingRecipients ? (
            <div className="flex items-center justify-center">
              <Loader2 className="size-4 animate-spin stroke-primary" />
            </div>
          ) : recipients.length === 0 ? (
            <NoRecipientsAlert emailId={emailId} />
          ) : showResults ? (
            <div className="space-y-4">
              <BroadcastStatus
                successCount={result.successCount}
                errorRecipients={result.errorRecipients}
              />
              <div className="text-muted-foreground text-sm">
                A CSV file with the results will be downloaded. Click{" "}
                <Button
                  variant="link"
                  onClick={() =>
                    downloadCsv({
                      recipientStatuses,
                      broadcastId: broadcastFormValues.emailType
                    })
                  }
                  className="h-auto p-0"
                >
                  here
                </Button>{" "}
                if the file is not downloaded automatically.
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground text-sm">
                Please provide the number of recipients you want to send the broadcast to. The
                selected content {selectedContent.length === 1 ? "block" : "blocks"} will be sent to
                the provided number of recipients. Click{" "}
                <Button
                  variant="link"
                  onClick={handleTestEmail}
                  disabled={isTestEmailLoading}
                  aria-disabled={isTestEmailLoading}
                  aria-busy={isTestEmailLoading}
                  className="h-auto p-0"
                >
                  here {isTestEmailLoading && <Loader2 className="animate-spin" />}
                </Button>{" "}
                to send a test email to yourself.
              </p>

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSend)}
                  id="send-to-selected-recipients-form"
                  className="space-y-4"
                >
                  <RecipientFormFields csvError={csvError} csvParsing={csvParsing} />
                </form>
              </Form>
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline" type="button" disabled={isSending}>
              {showResults ? "Close" : "Cancel"}
            </Button>
          </DialogClose>
          {!showResults && (
            <Button
              type="submit"
              form="send-to-selected-recipients-form"
              disabled={disableSubmit}
              aria-disabled={disableSubmit}
              aria-busy={isSending}
            >
              {isSending ? (
                <>
                  <Loader2 className="animate-spin" />
                  {`Sending... ${progress.current}/${progress.total}`}
                </>
              ) : (
                "Send"
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
