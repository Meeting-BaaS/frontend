export type BroadcastRoute = {
  name: string
  description: string
  type: "create" | "view" | "send-broadcast" | "logs"
}

export const broadcastRoutes: BroadcastRoute[] = [
  {
    name: "Create Content",
    description: "Create new content blocks for your broadcasts",
    type: "create"
  },
  {
    name: "View Contents",
    description: "View all content blocks for your broadcasts",
    type: "view"
  },
  {
    name: "Send Broadcast",
    description: "Send broadcasts to subscribed users",
    type: "send-broadcast"
  },
  {
    name: "Email Logs",
    description: "View all email logs",
    type: "logs"
  }
]
