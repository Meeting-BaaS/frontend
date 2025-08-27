import { opacityVariant } from "@repo/shared/animations/opacity"
import { Badge } from "@repo/shared/components/ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "@repo/shared/components/ui/tooltip"
import { CREDENTIALS_URL } from "@repo/shared/lib/external-urls"
import { cn } from "@repo/shared/lib/utils"
import { motion } from "motion/react"
import Link from "next/link"

interface HeadingProps {
  title?: string
  description?: string | React.ReactNode
  titleContainerClassName?: string
  descriptionContainerClassName?: string
  webhookUrl?: string
  isLoadingWebhookUrl: boolean
}

export const Heading = ({
  title = "Meeting BaaS Developer Hub",
  description,
  titleContainerClassName,
  descriptionContainerClassName,
  webhookUrl,
  isLoadingWebhookUrl
}: HeadingProps) => {
  return (
    <>
      <div
        className={cn(
          "relative my-8 flex justify-center md:my-12 lg:my-20",
          titleContainerClassName,
          !isLoadingWebhookUrl && !webhookUrl && "mt-14 lg:mt-20"
        )}
      >
        <motion.h1
          {...opacityVariant()}
          className="scroll-m-20 text-center font-bold text-3xl tracking-tight md:text-left md:text-4xl lg:text-5xl"
        >
          {title}
        </motion.h1>
        {!isLoadingWebhookUrl && !webhookUrl && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Badge
                variant="warning"
                className="-translate-x-1/2 -top-10 absolute left-1/2"
                asChild
              >
                <Link href={CREDENTIALS_URL} target="_blank" rel="noopener noreferrer">
                  Webhook not configured
                </Link>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to configure a webhook path. This is required to send bots.</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      {description && (
        <div
          className={cn(
            "mx-auto my-2 max-w-3xl text-center text-lg text-muted-foreground md:mb-4 lg:mb-6",
            descriptionContainerClassName
          )}
        >
          {description}
        </div>
      )}
    </>
  )
}
