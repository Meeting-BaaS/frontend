import { useContext } from "react"
import { ScreenshotViewerContext } from "@/contexts/screenshot-viewer-context"

export function useScreenshotViewer() {
  const context = useContext(ScreenshotViewerContext)
  if (context === undefined) {
    throw new Error("useScreenshotViewer must be used within a ScreenshotViewerProvider")
  }
  return context
}
