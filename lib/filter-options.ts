export type Option = {
  label: string
  value: string
  searchParam: string
}

export type FilterState = {
  emailIdFilters: string[]
  accountEmail: string
}

export const allEmailTypes: Option[] = [
  {
    label: "Insufficient Tokens Recording",
    value: "insufficient_tokens_recording",
    searchParam: "insufficient-tokens-recording"
  },
  { label: "Payment Activation", value: "payment_activation", searchParam: "payment-activation" },
  { label: "Usage Report (Legacy)", value: "usage_report", searchParam: "usage-report" },
  { label: "Welcome", value: "welcome", searchParam: "welcome" },
  { label: "Usage Reports", value: "usage-reports", searchParam: "usage-reports" },
  { label: "Activity Updates", value: "activity-updates", searchParam: "activity-updates" },
  { label: "Error Report", value: "error-report", searchParam: "error-report" },
  { label: "Product Updates", value: "product-updates", searchParam: "product-updates" },
  { label: "Maintenance", value: "maintenance", searchParam: "maintenance" },
  { label: "Company News", value: "company-news", searchParam: "company-news" },
  { label: "API Changes", value: "api-changes", searchParam: "api-changes" },
  {
    label: "Developer Resources",
    value: "developer-resources",
    searchParam: "developer-resources"
  },
  { label: "Security", value: "security", searchParam: "security" },
  { label: "Billing", value: "billing", searchParam: "billing" },
  { label: "Custom", value: "custom", searchParam: "custom" }
]

export const filtersFields = [
  {
    name: "emailIdFilters",
    label: "Email Type",
    options: [...allEmailTypes].sort((a, b) => a.label.localeCompare(b.label))
  }
]
