import { AlertCircle, CheckCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import type { Recipient } from "@/lib/broadcast-types"

interface BroadcastStatusProps {
  successCount: number
  errorRecipients: Recipient[]
  onRetry?: (recipients: Recipient[]) => void
}

export function BroadcastStatus({ successCount, errorRecipients, onRetry }: BroadcastStatusProps) {
  if (errorRecipients.length === 0) {
    return (
      <Alert variant="default">
        <CheckCircle className="size-4" />
        <AlertDescription>
          Emails have been successfully sent to {successCount} recipient(s)
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <Alert variant="destructive" className="border-destructive">
      <AlertCircle className="size-4" />
      <AlertDescription>
        <div>
          Emails have been successfully sent to {successCount} recipient(s). They failed for{" "}
          {errorRecipients.length} recipient(s). <br />
          {onRetry && (
            <>
              Click{" "}
              <Button
                variant="link"
                onClick={() => onRetry(errorRecipients)}
                className="h-auto p-0 text-destructive underline"
              >
                here
              </Button>{" "}
              to retry sending emails to the failed recipients.
            </>
          )}
        </div>
      </AlertDescription>
    </Alert>
  )
}
