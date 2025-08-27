"use client"

import { homeCardsVariant } from "@repo/shared/animations/home-cards"
import { Button } from "@repo/shared/components/ui/button"
import { AnimatePresence, motion } from "motion/react"
import Link from "next/link"
import { useState } from "react"
import { AppCardsSection } from "@/components/home/app-cards"
import type { Tab } from "@/components/home/card-definitions"
import { Heading } from "@/components/home/heading"
import { McpSection } from "@/components/home/mcp-section"
import { useWebhook } from "@/hooks/use-webhook"

interface CardsProps {
  noBotsSent: boolean
  chatId: string | null
}

export const Cards = ({ noBotsSent, chatId }: CardsProps) => {
  const [currentTab, setCurrentTab] = useState<Tab>("home-cards")
  const [isInitialRender, setIsInitialRender] = useState(true)
  const { webhookUrl, isLoadingWebhookUrl } = useWebhook()

  const handleTabChange = (newTab: Tab) => {
    setIsInitialRender(false)
    setCurrentTab(newTab)
  }

  const renderHeading = () => {
    switch (currentTab) {
      case "home-cards":
        return <Heading webhookUrl={webhookUrl} isLoadingWebhookUrl={isLoadingWebhookUrl} />
      case "mcp-cards":
        return (
          <Heading
            title="MCP Servers"
            titleContainerClassName="mb-2 md:mb-2 lg:mb-2"
            description={
              <>
                MCP servers let you connect Meeting BaaS to external tools and LLMs, such as{" "}
                <Button variant="link" className="h-auto p-0 text-lg" asChild>
                  <Link
                    href="https://docs.cursor.com/context/model-context-protocol"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Cursor
                  </Link>
                </Button>{" "}
                or{" "}
                <Button variant="link" className="h-auto p-0 text-lg" asChild>
                  <Link
                    href="https://modelcontextprotocol.io/quickstart/user"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Claude
                  </Link>
                </Button>
                , using the <span className="font-semibold">Model Context Protocol</span>. All
                servers are open source, and most are available hosted within Meeting BaaS.
              </>
            }
            webhookUrl={webhookUrl}
            isLoadingWebhookUrl={isLoadingWebhookUrl}
          />
        )
      default:
        return null
    }
  }

  const renderCards = () => {
    switch (currentTab) {
      case "home-cards":
        return (
          <AppCardsSection
            setCurrentTab={handleTabChange}
            isInitialRender={isInitialRender}
            noBotsSent={noBotsSent}
            chatId={chatId}
          />
        )
      case "mcp-cards":
        return <McpSection goBack={() => handleTabChange("home-cards")} />
      default:
        return null
    }
  }

  return (
    <>
      {renderHeading()}
      <motion.div {...homeCardsVariant}>
        <AnimatePresence mode="wait">{renderCards()}</AnimatePresence>
      </motion.div>
    </>
  )
}
