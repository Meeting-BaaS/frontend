"use client"

import { useEmailPreferences } from "@/hooks/use-email-preferences"
import type { DomainConfig, EmailType } from "@/lib/email-types"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { getDomainFrequency } from "@/components/email-preferences/domain-frequency"
import { DomainHeader } from "@/components/email-preferences/domain-header"
import { ServiceWideControls } from "@/components/email-preferences/service-wide-controls"
import { EmailSettings } from "@/components/email-preferences/email-settings"
import { UnsubscribedState } from "@/components/email-preferences/unsubscribed-state"
import { EmailPreference } from "@/components/email-preferences/email-preference-card"
import { AccountSection } from "@/components/email-preferences/account-section"
import { UnsubscribeDialog } from "@/components/email-preferences/unsubscribe-dialog"
import { getEmailsByDomain } from "@/components/email-preferences/email-categories"

type ConfirmDialog = {
  isOpen: boolean
  emailType: string
  emailName: string
}
const defaultConfirmDialog: ConfirmDialog = {
  isOpen: false,
  emailType: "",
  emailName: ""
}

export default function DomainEmailPreferences({
  domainConfig,
  unsubscribeEmailType,
  emailTypes
}: {
  domainConfig: DomainConfig
  unsubscribeEmailType?: EmailType
  emailTypes: EmailType[]
}) {
  const { preferences, isLoading, updateService } = useEmailPreferences()

  // If there's an unsubscribe parameter, show the confirm dialog
  let initialConfirmDialog = { ...defaultConfirmDialog }
  if (unsubscribeEmailType) {
    initialConfirmDialog = {
      isOpen: true,
      emailType: unsubscribeEmailType.id,
      emailName: unsubscribeEmailType.name
    }
  }

  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialog>(initialConfirmDialog)

  // If preferences haven't loaded yet, show loading state
  if (isLoading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="size-4 animate-spin stroke-primary" />
      </div>
    )
  }

  const domainFrequency = getDomainFrequency(domainConfig.type, preferences, emailTypes)
  const domainEmails = getEmailsByDomain(emailTypes, domainConfig.type)

  return (
    <>
      <DomainHeader config={domainConfig} />
      {domainConfig.type !== "account" ? (
        <>
          <ServiceWideControls
            domainConfig={domainConfig}
            emailTypes={domainEmails}
            onUnsubscribe={(emailType: string, emailName: string) =>
              setConfirmDialog({
                isOpen: true,
                emailType,
                emailName
              })
            }
          />

          {domainFrequency !== "Never" ? (
            <EmailSettings
              emailTypes={domainEmails}
              onUnsubscribe={(emailType: string, emailName: string) =>
                setConfirmDialog({
                  isOpen: true,
                  emailType,
                  emailName
                })
              }
            />
          ) : (
            <UnsubscribedState
              domainConfig={domainConfig}
              onResubscribe={() =>
                updateService({ domain: domainConfig.type, frequency: "Weekly", emailTypes })
              }
            />
          )}
          <div className="mt-4 space-y-4">
            {/* Always show required emails, even when domain is set to 'Never' */}
            {domainEmails
              .filter((email) => email.required)
              .map((emailType) => (
                <EmailPreference
                  key={emailType.id}
                  emailType={emailType}
                  onUnsubscribe={(emailType: string, emailName: string) =>
                    setConfirmDialog({
                      isOpen: true,
                      emailType,
                      emailName
                    })
                  }
                />
              ))}
          </div>
        </>
      ) : (
        <AccountSection
          domain={domainConfig.type}
          emailTypes={domainEmails}
          onUnsubscribe={(emailType: string, emailName: string) =>
            setConfirmDialog({
              isOpen: true,
              emailType,
              emailName
            })
          }
        />
      )}

      {/* Confirmation Dialog */}
      <UnsubscribeDialog
        isOpen={confirmDialog.isOpen}
        onDialogClose={() => setConfirmDialog(defaultConfirmDialog)}
        emailType={confirmDialog.emailType}
        emailName={confirmDialog.emailName}
        emailTypes={emailTypes}
      />
    </>
  )
}
