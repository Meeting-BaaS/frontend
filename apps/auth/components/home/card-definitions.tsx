import { GitHubLogo } from "@repo/shared/components/icons/github"
import {
  AI_CHAT_GITHUB_URL,
  AI_CHAT_URL,
  BILLING_URL,
  BOT_ANALYTICS_URL,
  CONTRIBUTION_GITHUB_URL,
  CREDENTIALS_URL,
  DISCORD_URL,
  LOGS_URL,
  MEETING_BAAS_API_DOCS_URL,
  MEETING_BAAS_DOCS_GITHUB_URL,
  STATUS_URL,
  TRANSCRIPT_SEEKER_APP_URL,
  TRANSCRIPT_SEEKER_DOCS_URL,
  TRANSCRIPT_SEEKER_GITHUB_URL,
  USAGE_URL
} from "@repo/shared/lib/external-urls"
import {
  BarChart3,
  BookOpen,
  ChartGantt,
  CircleCheck,
  ExternalLink,
  Logs,
  MessageSquare,
  ReceiptText,
  Server,
  Settings,
  Video,
  Webhook
} from "lucide-react"
import { DiscordLogo } from "@/components/icons/discord"

export type Tab = "home-cards" | "mcp-cards"

export type AppLink = {
  href: string
  type: "Docs" | "App" | "GitHub"
  icon: React.ReactNode
  tab?: Tab
}

export type AppCard = {
  title: string
  description: string
  links: AppLink[]
  icon: React.ReactNode
}

export type Utility = {
  href: string
  title: string
  icon: React.ReactNode
  className?: string
  showWebhookStatusDot?: boolean
}

const cardIconClasses = "size-5.5"
const utilityIconClasses = cardIconClasses

export const appCards: AppCard[] = [
  {
    title: "API Documentation",
    description:
      "Technical documentation for bot deployment, calendar sync, and real-time streaming. Includes latest updates and changelogs.",
    links: [
      {
        href: MEETING_BAAS_API_DOCS_URL,
        type: "App",
        icon: <ExternalLink />
      },
      {
        href: MEETING_BAAS_DOCS_GITHUB_URL,
        type: "GitHub",
        icon: <GitHubLogo />
      }
    ],
    icon: <Webhook className={cardIconClasses} />
  },
  {
    title: "AI Chat",
    description:
      "Chat with our API using natural language. Send bots, debug issues, and try all functionnalities from our MCP servers.",
    links: [
      {
        href: AI_CHAT_URL,
        type: "App",
        icon: <ExternalLink />
      },
      {
        href: AI_CHAT_GITHUB_URL,
        type: "GitHub",
        icon: <GitHubLogo />
      }
    ],
    icon: <MessageSquare className={cardIconClasses} />
  },
  {
    title: "Status",
    description: "View the performance of all meeting bots across the platform.",
    links: [
      {
        href: STATUS_URL,
        type: "App",
        icon: <ExternalLink />
      }
    ],
    icon: <CircleCheck className={cardIconClasses} />
  },
  {
    title: "Logs Table",
    description: "Track your meeting bots and view the status of your recordings.",
    links: [
      {
        href: LOGS_URL,
        type: "App",
        icon: <ExternalLink />
      }
    ],
    icon: <Logs className={cardIconClasses} />
  },
  {
    title: "Bot Analytics",
    description:
      "Monitor usage, performance metrics, and duration trends for your meeting bots across platforms.",
    links: [
      {
        href: BOT_ANALYTICS_URL,
        type: "App",
        icon: <ExternalLink />
      }
    ],
    icon: <BarChart3 className={cardIconClasses} />
  },
  // {
  //     title: "Real-time Transcription",
  //     description:
  //         "Get real-time transcriptions during your meetings, with speaker identification and accurate text output.",
  //     links: [
  //         {
  //             href: REAL_TIME_TRANSCRIPTION_GITHUB_URL,
  //             type: "GitHub",
  //             icon: <GitHubLogo />
  //         }
  //     ],
  //     icon: <Captions className={cardIconClasses} />
  // },
  {
    title: "Discord",
    description: "Join our server to get help, share ideas, and connect with other users.",
    links: [
      {
        href: DISCORD_URL,
        type: "App",
        icon: <ExternalLink />
      }
    ],
    icon: <DiscordLogo className={`${cardIconClasses} fill-foreground`} />
  },
  {
    title: "MCP Servers",
    description: "Connect Meeting BaaS directly to your tools or AI agents through MCP servers.",
    links: [
      {
        href: "",
        type: "App",
        icon: <ExternalLink />,
        tab: "mcp-cards"
      }
    ],
    icon: <Server className={cardIconClasses} />
  },
  {
    title: "Transcript Seeker",
    description:
      "Upload meetings to get transcripts and chat with your recordings using an open source interface.",
    links: [
      {
        href: TRANSCRIPT_SEEKER_APP_URL,
        type: "App",
        icon: <ExternalLink />
      },
      {
        href: TRANSCRIPT_SEEKER_DOCS_URL,
        type: "Docs",
        icon: <BookOpen />
      },
      {
        href: TRANSCRIPT_SEEKER_GITHUB_URL,
        type: "GitHub",
        icon: <GitHubLogo />
      }
    ],
    icon: <Video className={cardIconClasses} />
  }
]

export const utilities: Utility[] = [
  {
    icon: <Settings className={utilityIconClasses} />,
    title: "API Keys",
    href: CREDENTIALS_URL,
    showWebhookStatusDot: true,
    className: "border-r border-b rounded-tl-xl"
  },
  {
    icon: <ChartGantt className={utilityIconClasses} />,
    title: "Usage",
    href: USAGE_URL
  },
  {
    icon: <ReceiptText className={utilityIconClasses} />,
    title: "Billing",
    href: BILLING_URL
  },
  {
    icon: <GitHubLogo className={utilityIconClasses} />,
    title: "GitHub",
    href: CONTRIBUTION_GITHUB_URL
  }
]
