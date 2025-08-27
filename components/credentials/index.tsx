"use client"

import { ApiKey } from "@/components/credentials/api-key"
import { WebhookForm } from "@/components/credentials/webhook-form"

interface CredentialsProps {
  apiKey: string
}

export default function Credentials({ apiKey }: CredentialsProps) {
  return (
    <div className="flex flex-col gap-8">
      <ApiKey apiKey={apiKey} />
      <WebhookForm />
    </div>
  )
}
