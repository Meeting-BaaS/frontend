import type { Tab } from "@/components/home/card-definitions"
import { appCards, utilities } from "@/components/home/card-definitions"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn, getChatUrl } from "@/lib/utils"
import Link from "next/link"
import type { AppLink } from "@/components/home/card-definitions"
import { motion, useReducedMotion } from "motion/react"
import { homeCardsVariants } from "@/animations/card-transitions"
import { useState, useEffect, useRef } from "react"
import { FirstSignupDialog } from "@/components/home/first-signup-dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { MessageSquarePlus } from "lucide-react"
import { useWebhook } from "@/hooks/use-webhook"

interface AppCardsSectionProps {
    setCurrentTab: (tab: Tab) => void
    isInitialRender: boolean
    noBotsSent: boolean
    chatId: string | null
}

export const AppCardsSection = ({
    setCurrentTab,
    isInitialRender,
    noBotsSent,
    chatId
}: AppCardsSectionProps) => {
    const shouldReduceMotion = useReducedMotion()
    const { webhookUrl, isLoadingWebhookUrl } = useWebhook()
    // only show the dialog on initial render if the user has no tokens
    const [showDialog, setShowDialog] = useState(isInitialRender && noBotsSent)
    const [showTooltip, setShowTooltip] = useState(false)
    const tooltipTimerRef = useRef<NodeJS.Timeout>(null)

    const handleDialogOpenChange = (open: boolean) => {
        setShowDialog(open)
        if (!open) {
            setShowTooltip(true)
            tooltipTimerRef.current = setTimeout(() => {
                setShowTooltip(false)
            }, 5000)
        }
    }

    useEffect(() => {
        return () => {
            if (tooltipTimerRef.current) {
                clearTimeout(tooltipTimerRef.current)
            }
        }
    }, [])

    return (
        <motion.div
            key="home-cards"
            variants={homeCardsVariants(shouldReduceMotion ?? false)}
            initial={isInitialRender ? false : "initial"}
            animate="animate"
            exit="exit"
        >
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {appCards?.length > 0 ? (
                    appCards.map(({ icon, title, links, description }, index) => {
                        const appLink = links.find((link) => link.type === "App")
                        let handleCardClick = () => {}
                        if (appLink) {
                            handleCardClick =
                                appLink.tab !== undefined
                                    ? () => setCurrentTab(appLink.tab!)
                                    : () =>
                                          window.open(appLink.href, "_blank", "noopener,noreferrer")
                        }
                        return (
                            <Card
                                key={index}
                                className={cn(
                                    "group relative grow transition-colors",
                                    appLink && "cursor-pointer hover:border-baas-primary-700"
                                )}
                                aria-label={`${title} card - click to open app`}
                                onClick={handleCardClick}
                            >
                                {title === "AI Chat" && noBotsSent && (
                                    <TooltipProvider>
                                        <Tooltip open={showTooltip} onOpenChange={setShowTooltip}>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    size="icon"
                                                    className="absolute top-4 right-4 rounded-full"
                                                    aria-label="Get started using AI Chat"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        window.open(getChatUrl(chatId), "_blank")
                                                    }}
                                                >
                                                    <MessageSquarePlus />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>I am here to help you get started.</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}
                                <CardContent className="flex min-h-44 grow flex-col justify-between gap-2 pt-4">
                                    <div className="flex flex-col gap-2">
                                        <div className="flex items-center gap-2 font-semibold text-lg">
                                            {icon} {title}
                                        </div>
                                        <div className="text-md text-neutral-500 leading-relaxed dark:text-neutral-400">
                                            {description}
                                        </div>
                                    </div>
                                    <div className="pointer-touch-opacity-100 mt-2 flex flex-wrap gap-2 opacity-0 transition-opacity focus-within:opacity-100 group-focus-within:opacity-100 group-hover:opacity-100">
                                        {links.map((link: AppLink) => (
                                            <Button
                                                key={link.type}
                                                variant="outline"
                                                className={cn(
                                                    "bg-transparent fill-foreground px-2 py-1.5",
                                                    link.type === "App" && "md:hidden"
                                                )}
                                                asChild
                                            >
                                                {link.href ? (
                                                    <Link
                                                        href={link.href}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            {link.icon}
                                                            {link.type}
                                                        </span>
                                                    </Link>
                                                ) : (
                                                    <button type="button" onClick={handleCardClick}>
                                                        {link.icon}
                                                        {link.type}
                                                    </button>
                                                )}
                                            </Button>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })
                ) : (
                    <p className="col-span-full text-center text-muted-foreground">
                        No applications available
                    </p>
                )}
                <Card className="group relative grow p-0">
                    <CardContent className="card-grid grid grow grid-cols-2 grid-rows-2 p-0">
                        {utilities.map(({ title, icon, href, className, showWebhookStatusDot }) => (
                            <Button
                                key={title}
                                variant="outline"
                                className={cn(
                                    "h-full min-h-28 w-full rounded-none border-0 bg-transparent fill-foreground p-3 text-lg",
                                    className
                                )}
                                asChild
                            >
                                <Link target="_blank" rel="noopener noreferrer" href={href}>
                                    {icon}
                                    <span className="relative">
                                        {title}
                                        {showWebhookStatusDot &&
                                            !isLoadingWebhookUrl &&
                                            !webhookUrl && (
                                                <div className="-top-0.5 -right-2 absolute size-2 rounded-full bg-destructive" />
                                            )}
                                    </span>
                                </Link>
                            </Button>
                        ))}
                    </CardContent>
                </Card>
            </div>
            <FirstSignupDialog
                open={showDialog}
                onOpenChange={handleDialogOpenChange}
                chatId={chatId}
            />
        </motion.div>
    )
}
