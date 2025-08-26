import { AlertCircle } from "lucide-react"
import { Alert, AlertTitle } from "@/components/ui/alert"
import { errorDescription, genericError } from "@/lib/errors"

export const CallbackError = ({ error }: { error: keyof typeof errorDescription }) => {
    if (!error) return null

    return (
        <Alert variant="destructive">
            <AlertCircle size={16} />
            <AlertTitle className="mb-0 text-left leading-normal">
                {error in errorDescription ? errorDescription[error] : genericError}
            </AlertTitle>
        </Alert>
    )
}
