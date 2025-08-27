import { useContext } from "react"
import { SelectedErrorContext } from "@/contexts/selected-error-context"

export function useSelectedErrorContext() {
  const context = useContext(SelectedErrorContext)
  if (context === undefined) {
    throw new Error("useSelectedErrorContext must be used within a SelectedErrorProvider")
  }
  return context
}
