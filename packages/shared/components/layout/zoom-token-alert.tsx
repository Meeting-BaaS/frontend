import type { ClassValue } from "clsx"
import { AlertCircleIcon } from "lucide-react"
import Link from "next/link"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { cn } from "@/lib/utils"

const ZOOM_OBF_TOKEN_BLOG_URL = "https://www.meetingbaas.com/en/blog/zoom-obf-token-changes"

interface ZoomTokenAlertProps {
  overrideClassName?: ClassValue
}

export function ZoomTokenAlert({ overrideClassName }: ZoomTokenAlertProps) {
  return (
    <Alert
      variant="warning"
      className={cn(
        "sticky top-14 z-40 mx-auto box-content w-full max-w-container backdrop-blur-xl lg:top-16 mt-2 lg:w-[calc(100%-6rem)] lg:rounded-2xl lg:border dark:border-red-700 text-red-500 bg-red-500/10 dark:bg-red-700/10 dark:text-red-500 *:data-[slot=alert-description]:text-foreground",
        overrideClassName
      )}
    >
      <AlertCircleIcon />
      <AlertTitle>Zoom bots must be authorized</AlertTitle>
      <AlertDescription>
        <div>
          <span className="font-bold">Beginning March 2 2026</span>, Zoom bots must be authorized.
          Authorize your bots by using creating a Zoom marketplace application, OBF or ZAK tokens.{" "}
          <Link
            href={ZOOM_OBF_TOKEN_BLOG_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline font-medium hover:no-underline"
          >
            Learn more
          </Link>
        </div>
      </AlertDescription>
    </Alert>
  )
}
