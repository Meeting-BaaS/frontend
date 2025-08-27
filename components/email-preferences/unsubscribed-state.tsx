"use client"

import type { DomainConfig } from "@/lib/email-types"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface UnsubscribedStateProps {
  domainConfig: DomainConfig
  onResubscribe: () => void
}

export const UnsubscribedState = ({ domainConfig, onResubscribe }: UnsubscribedStateProps) => {
  return (
    <Card className="mb-6 text-center text-muted-foreground">
      <CardContent>
        <p className="mb-1">You've unsubscribed from all optional {domainConfig.name} emails.</p>
        <Button
          variant="link"
          type="button"
          onClick={() => onResubscribe()}
          aria-label={`Resubscribe to ${domainConfig.name} emails`}
        >
          Resubscribe
        </Button>
      </CardContent>
    </Card>
  )
}
