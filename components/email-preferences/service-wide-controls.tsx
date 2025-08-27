"use client"

import { Info } from "lucide-react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { RadioGroup } from "@/components/ui/radio-group"

import { useEmailPreferences } from "@/hooks/use-email-preferences"
import type { DomainConfig, EmailFrequency, EmailType } from "@/lib/email-types"
import { cn } from "@/lib/utils"
import { EmailFrequencyRadio } from "@/components/email-preferences/email-frequency-radio"
import { getDomainFrequency } from "@/components/email-preferences/domain-frequency"
import { frequencies } from "@/components/email-preferences/email-preference-card"

const ServiceWideFrequencies: EmailFrequency[] = [...frequencies, "Never"]

interface ServiceWideControlsProps {
  domainConfig: DomainConfig
  emailTypes: EmailType[]
  onUnsubscribe: (emailId: string, emailName: string) => void
}

export const ServiceWideControls = ({
  domainConfig,
  emailTypes,
  onUnsubscribe
}: ServiceWideControlsProps) => {
  const { preferences, updateService } = useEmailPreferences()
  const optionalEmails = emailTypes.filter((e) => !e.required)

  if (optionalEmails.length <= 1) return null

  const domainFrequency = getDomainFrequency(domainConfig.type, preferences, emailTypes)

  const handleServiceSubscription = (frequency: EmailFrequency) => {
    if (frequency === "Never") {
      onUnsubscribe(`service-${domainConfig.type}`, `all optional ${domainConfig.name}`)
      return
    }
    updateService({ domain: domainConfig.type, frequency, emailTypes })
  }

  return (
    <Card className="mb-8 dark:bg-baas-neutral-500/30">
      <CardContent>
        <div className="mb-4 flex items-center gap-2">
          <div className={cn("h-6 w-2 rounded-full", domainConfig.color)} />
          <h3 className="font-medium text-lg">Service-wide Frequency</h3>
        </div>

        <p className="mb-4 text-muted-foreground text-sm">
          Control how often you receive all optional{" "}
          <span className="font-bold">{domainConfig.name.toLowerCase()}</span> in a single place.
        </p>

        <RadioGroup
          value={domainFrequency === "Mixed" ? "" : domainFrequency}
          onValueChange={(value) => handleServiceSubscription(value as EmailFrequency)}
          className="grid grid-cols-1 gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          {ServiceWideFrequencies.map((frequency) => (
            <EmailFrequencyRadio
              key={frequency}
              frequency={frequency}
              currentFrequency={domainFrequency === "Mixed" ? undefined : domainFrequency}
              domainConfig={domainConfig}
            />
          ))}
        </RadioGroup>

        {!["Never", "Mixed"].includes(domainFrequency) && (
          <Alert className="mt-4" variant="info">
            <Info className="size-4" />
            <AlertDescription>
              You will receive {domainFrequency.toLowerCase()} emails for all optional{" "}
              {domainConfig.name.toLowerCase()} notifications.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  )
}
