"use client"

import SharedErrorBoundary from "@repo/shared/components/error"

interface ErrorProps {
    error: Error & { digest?: string }
    reset: () => void
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
    return <SharedErrorBoundary error={error} reset={reset} />
}
