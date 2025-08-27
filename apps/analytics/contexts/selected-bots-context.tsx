"use client"

import { createContext, type ReactNode, useState } from "react"
import { v4 as uuidv4 } from "uuid"
import { setupPostMessageHandler } from "@/lib/post-message"
import { createLogsSearchParams, createLogsUrl } from "@/lib/search-params"
import type { FormattedBotData } from "@/lib/types"

interface SelectedBotsContextType {
  selectedBots: FormattedBotData[]
  toggleBotSelection: (bot: FormattedBotData, selected?: boolean) => void
  clearSelectedBots: () => void
  isSelected: (botId: string) => boolean
  openLogs: (startDate: Date | null, endDate: Date | null, botIds?: string[]) => void
  hoveredBots: FormattedBotData[]
  setHoveredBots: (bots: FormattedBotData[]) => void
  selectBotsByCategory: (bots: FormattedBotData[], selected?: boolean) => void
}

export const SelectedBotsContext = createContext<SelectedBotsContextType | undefined>(undefined)

export function SelectedBotsProvider({ children }: { children: ReactNode }) {
  const [selectedBots, setSelectedBots] = useState<FormattedBotData[]>([])
  const [hoveredBots, setHoveredBots] = useState<FormattedBotData[]>([])

  const toggleBotSelection = (bot: FormattedBotData, selected?: boolean) => {
    const isCurrentlySelected = selectedBots.some((selected) => selected.uuid === bot.uuid)

    // If selected is explicitly provided, use that value
    const shouldBeSelected = selected !== undefined ? selected : !isCurrentlySelected

    if (shouldBeSelected && !isCurrentlySelected) {
      setSelectedBots([...selectedBots, bot])
    } else if (!shouldBeSelected && isCurrentlySelected) {
      setSelectedBots(selectedBots.filter((selected) => selected.uuid !== bot.uuid))
    }
  }

  // Add a function to select all bots in a category at once
  const selectBotsByCategory = (bots: FormattedBotData[], selected?: boolean) => {
    if (bots.length === 0) return

    const selectedUuids = new Set(selectedBots.map((bot) => bot.uuid))
    const botUuids = new Set(bots.map((bot) => bot.uuid))

    // Check if all bots in this category are already selected
    const allAlreadySelected = bots.every((bot) => selectedUuids.has(bot.uuid))

    // If selected state is provided, use that, otherwise toggle based on current state
    const shouldSelect = selected !== undefined ? selected : !allAlreadySelected

    if (shouldSelect) {
      // Add all bots that aren't already selected
      const botsToAdd = bots.filter((bot) => !selectedUuids.has(bot.uuid))

      if (botsToAdd.length > 0) {
        setSelectedBots([...selectedBots, ...botsToAdd])
      }
    } else {
      // Remove all bots in this category
      setSelectedBots(selectedBots.filter((bot) => !botUuids.has(bot.uuid)))
    }
  }

  const clearSelectedBots = () => {
    setSelectedBots([])
  }

  const isSelected = (botId: string) => {
    return selectedBots.some((bot) => bot.uuid === botId)
  }

  const openLogs = (startDate: Date | null, endDate: Date | null, botIds?: string[]) => {
    // Use provided botIds or take from selectedBots
    const botUuids = botIds || selectedBots.map((bot) => bot.uuid)

    // If no bot UUIDs, just open with date params
    if (botUuids.length === 0) {
      const searchParams = createLogsSearchParams(startDate, endDate)
      window.open(createLogsUrl("/", searchParams), "_blank")
      return
    }

    // For bot UUIDs, use postMessage approach
    const windowId = crypto.randomUUID?.() ?? uuidv4()
    const searchParams = createLogsSearchParams(startDate, endDate, windowId, true)
    const newWindow = window.open(createLogsUrl("/", searchParams), "_blank")
    if (!newWindow) {
      console.error("Failed to open logs window")
      return
    }

    // Set up message handler
    setupPostMessageHandler({
      windowId,
      botUuids,
      onComplete: () => {
        // Each handler cleans itself up after successful communication
      }
    })
  }

  return (
    <SelectedBotsContext.Provider
      value={{
        selectedBots,
        toggleBotSelection,
        clearSelectedBots,
        isSelected,
        openLogs,
        hoveredBots,
        setHoveredBots,
        selectBotsByCategory
      }}
    >
      {children}
    </SelectedBotsContext.Provider>
  )
}
