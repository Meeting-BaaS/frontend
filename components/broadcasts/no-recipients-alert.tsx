import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { EmailIdTypeMap } from "@/components/broadcasts/logs/column-helpers"
import type { EmailId } from "@/lib/email-types"

interface NoRecipientsAlertProps {
  emailId: string
}

export function NoRecipientsAlert({ emailId }: NoRecipientsAlertProps) {
  return (
    <Alert variant="destructive" className="border-destructive">
      <AlertCircle className="size-4" />
      <AlertDescription>
        <div>
          No recipients have subscribed to receive{" "}
          <span className="font-bold">{EmailIdTypeMap[emailId as EmailId]}</span> on this frequency.
        </div>
      </AlertDescription>
    </Alert>
  )
}
