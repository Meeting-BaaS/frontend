import { useContext } from "react"
import { SelectedBotsContext } from "@/contexts/selected-bots-context"

export function useSelectedBots() {
  const context = useContext(SelectedBotsContext)

  if (context === undefined) {
    throw new Error("useSelectedBots must be used within a SelectedBotsProvider")
  }

  return context
}
