"use client"

import { Button } from "@/components/ui/button"
import { ExternalLink, Trash2 } from "lucide-react"
import { useSelectedBots } from "@/hooks/use-selected-bots"
import { motion, AnimatePresence } from "motion/react"
import { MousePointerClick } from "lucide-react"
import { useScrollOpacity } from "@/hooks/use-scroll-opacity"
import { useEffect, useState, useMemo } from "react"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from "@/components/ui/accordion"
import {
  containerVariants,
  containerTransition,
  allLogsButtonVariants,
  allLogsButtonTransition,
  childrenVariants
} from "@/components/animations/selected-bots"

interface SelectedBotsButtonProps {
  dateRange: { startDate: Date | null; endDate: Date | null }
}

export function SelectedBotsButton({ dateRange }: SelectedBotsButtonProps) {
  const { selectedBots, hoveredBots, openLogs, clearSelectedBots } = useSelectedBots()
  const opacity = useScrollOpacity()
  const [isOpen, setIsOpen] = useState("details")

  const uiConfig = useMemo(() => {
    const hasSelected = selectedBots.length > 0
    const hasHovered = hoveredBots.length > 0
    const bots = hasSelected ? selectedBots : hoveredBots
    const count = bots.length

    const getSelectionHint = () => {
      if (hasHovered) return "Click to select these bots"
      if (hasSelected) return "Click other sections to add more"
      return null
    }

    return {
      mode: hasSelected ? "selected" : hasHovered ? "hovered" : "default",
      count,
      bots,
      title: `${count} ${count === 1 ? "Bot" : "Bots"} ${hasSelected ? "Selected" : "Highlighted"}`,
      showClearButton: hasSelected,
      showMoreText: count > 5 ? `+ ${count - 5} more` : null,
      selectionHint: getSelectionHint(),
      actionButton: hasSelected
        ? {
            label: "View Selected Logs",
            onClick: () =>
              openLogs(
                dateRange.startDate,
                dateRange.endDate,
                selectedBots.map((bot) => bot.uuid)
              ),
            icon: ExternalLink
          }
        : {
            label: "View All Logs",
            onClick: () => openLogs(dateRange.startDate, dateRange.endDate),
            icon: ExternalLink
          }
    }
  }, [selectedBots, hoveredBots, dateRange, openLogs])

  useEffect(() => {
    if (uiConfig.mode !== "default") {
      setIsOpen("details")
    }
  }, [uiConfig.mode])

  return (
    <motion.div
      className="fixed right-4 bottom-4 z-50 flex flex-col items-end gap-2"
      animate={{ opacity }}
      transition={{ duration: 0.1 }}
    >
      <AnimatePresence mode="wait">
        {uiConfig.mode === "default" ? (
          <motion.div
            key="all-logs"
            variants={allLogsButtonVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={allLogsButtonTransition}
          >
            <Button
              onClick={uiConfig.actionButton.onClick}
              className="bg-primary/90 shadow-md hover:bg-primary"
              size="sm"
            >
              {uiConfig.actionButton.label} <uiConfig.actionButton.icon />
            </Button>
          </motion.div>
        ) : (
          <motion.div
            key="bot-details"
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={containerTransition}
            className="flex flex-col gap-3 rounded-lg border border-baas-primary-700 bg-popover p-4 shadow-xl"
          >
            <Accordion type="single" collapsible value={isOpen} onValueChange={setIsOpen}>
              <AccordionItem value="details">
                <AccordionTrigger className="p-0 hover:no-underline">
                  <div className="flex items-center gap-2">
                    <motion.span
                      key={uiConfig.mode}
                      variants={childrenVariants}
                      custom={0}
                      initial="initial"
                      animate="animate"
                      exit="exit"
                      className="font-semibold text-base"
                    >
                      {uiConfig.title}
                    </motion.span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <motion.div
                    variants={childrenVariants}
                    custom={1}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    className="mt-2 max-w-52 border-primary/20 border-l-2 pl-2 text-foreground/80 text-xs"
                  >
                    {uiConfig.bots.slice(0, 5).map((bot, index) => (
                      <motion.div
                        key={bot.uuid}
                        variants={childrenVariants}
                        custom={index + 2}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="truncate py-0.5"
                      >
                        {bot.uuid.substring(0, 6)}...{bot.uuid.substring(bot.uuid.length - 4)} -{" "}
                        {bot.status.value}
                      </motion.div>
                    ))}
                    {uiConfig.showMoreText && (
                      <motion.div
                        variants={childrenVariants}
                        custom={7}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="text-muted-foreground italic"
                      >
                        {uiConfig.showMoreText}
                      </motion.div>
                    )}
                    {uiConfig.selectionHint && (
                      <motion.div
                        variants={childrenVariants}
                        custom={8}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="mt-2 text-foreground"
                      >
                        {uiConfig.selectionHint}
                      </motion.div>
                    )}
                  </motion.div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <motion.div
              variants={childrenVariants}
              custom={9}
              initial="initial"
              animate="animate"
              exit="exit"
              className="flex gap-2"
            >
              {uiConfig.mode === "selected" ? (
                <>
                  <Button onClick={uiConfig.actionButton.onClick} className="grow">
                    {uiConfig.actionButton.label} <uiConfig.actionButton.icon />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    aria-label="Clear all selected bots"
                    onClick={clearSelectedBots}
                  >
                    <Trash2 />
                  </Button>
                </>
              ) : (
                <div className="flex grow items-center justify-center gap-2 rounded-md bg-muted/50 px-3 py-2 text-muted-foreground text-sm">
                  <MousePointerClick className="size-4" />
                  <span>Click to select these bots</span>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
