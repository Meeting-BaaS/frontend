import { AI_CHAT_URL, BILLING_URL, CONSUMPTION_URL, LOGS_URL } from "@/lib/external-urls"

export type MenuOption = {
  title: string
  href: string
  separator?: boolean
}

export const menuOptions: MenuOption[] = [
  {
    title: "Chat with BaaS",
    href: AI_CHAT_URL
  },
  {
    title: "Logs",
    href: LOGS_URL,
    separator: true
  },
  {
    title: "Consumption",
    href: CONSUMPTION_URL
  },
  {
    title: "Billing",
    href: BILLING_URL
  }
]
