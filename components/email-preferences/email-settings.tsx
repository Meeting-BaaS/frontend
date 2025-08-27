"use client"

import { Badge } from "@/components/ui/badge"

import { EmailPreference } from "@/components/email-preferences/email-preference-card"
import type { EmailType } from "@/lib/email-types"
import { useEmailPreferences } from "@/hooks/use-email-preferences"

interface EmailSettingsProps {
  emailTypes: EmailType[]
  onUnsubscribe: (emailId: string, emailName: string) => void
}

export const EmailSettings = ({ emailTypes, onUnsubscribe }: EmailSettingsProps) => {
  const { preferences } = useEmailPreferences()
  const optionalEmails = emailTypes.filter((e) => !e.required)
  const subscribedEmails = optionalEmails.filter((e) => preferences?.[e.id] !== "Never")

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-medium text-lg">Individual Email Settings</h3>
        <Badge variant="secondary" className="text-xs">
          {subscribedEmails.length} Optional Email{subscribedEmails.length === 1 ? "" : "s"}
        </Badge>
      </div>
      <div className="space-y-4">
        {optionalEmails.map((emailType) => (
          <EmailPreference key={emailType.id} emailType={emailType} onUnsubscribe={onUnsubscribe} />
        ))}
      </div>
    </>
  )
}
