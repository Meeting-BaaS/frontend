import type { ContentFormValues } from "@/lib/schemas/content"
import type {
  BroadcastParams,
  Content,
  EmailLogParams,
  EmailLogResponse,
  Recipient,
  RecipientParams
} from "@/lib/broadcast-types"

export async function saveContent(data: ContentFormValues) {
  const response = await fetch("/api/email/admin/content", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to save content: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export async function updateContent(data: ContentFormValues, id: number) {
  const response = await fetch("/api/email/admin/content", {
    method: "PUT",
    body: JSON.stringify({ ...data, id }),
    headers: {
      "Content-Type": "application/json"
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to update content: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export async function deleteContent(id: number) {
  const response = await fetch(`/api/email/admin/content/${id}`, {
    method: "DELETE"
  })

  if (!response.ok) {
    throw new Error(`Failed to delete content: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export async function getContents(): Promise<Content[]> {
  const response = await fetch("/api/email/admin/content")

  if (!response.ok) {
    throw new Error(`Failed to get contents: ${response.status} ${response.statusText}`)
  }

  const json = await response.json()

  return json.data
}

export async function getRecipients(params: RecipientParams): Promise<Recipient[]> {
  const queryParams = new URLSearchParams()
  queryParams.append("emailId", params.emailId)
  queryParams.append("frequency", params.frequency)

  if (params.botCountLessThan) {
    queryParams.append("botCountLessThan", params.botCountLessThan)
  }
  if (params.lastBotMoreThanDays) {
    queryParams.append("lastBotMoreThanDays", params.lastBotMoreThanDays)
  }

  const response = await fetch(`/api/email/admin/recipients?${queryParams.toString()}`)

  if (!response.ok) {
    throw new Error(`Failed to get recipients: ${response.status} ${response.statusText}`)
  }

  const json = await response.json()

  return json.data
}

export async function sendBroadcast(data: BroadcastParams) {
  const response = await fetch("/api/email/admin/send-email", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to send broadcast: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export async function getEmailLogs(params: EmailLogParams): Promise<EmailLogResponse> {
  const queryParams = new URLSearchParams()
  queryParams.append("offset", params.offset.toString())
  queryParams.append("limit", params.limit.toString())

  if (params.startDate) {
    queryParams.append("startDate", params.startDate)
  }
  if (params.endDate) {
    queryParams.append("endDate", params.endDate)
  }
  if (params.emailId) {
    queryParams.append("emailId", params.emailId)
  }
  if (params.accountEmail) {
    queryParams.append("accountEmail", params.accountEmail)
  }

  const response = await fetch(`/api/email/admin/email-logs?${queryParams.toString()}`)

  if (!response.ok) {
    throw new Error(`Failed to get email logs: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export async function getEmailHTML(emailId: number): Promise<string> {
  const response = await fetch(`/api/email/admin/email-html/${emailId}`)

  if (!response.ok) {
    throw new Error(`Failed to get email HTML: ${response.status} ${response.statusText}`)
  }

  return response.text()
}
