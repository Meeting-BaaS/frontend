"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useSelectedErrorContext } from "@/hooks/use-selected-error-context"
import { cn } from "@/lib/utils"
import { CheckSquare, RotateCcw, Square } from "lucide-react"
import { motion, AnimatePresence } from "motion/react"
import { formatNumber } from "@/lib/utils"
import type { ErrorDistribution } from "@/lib/types"
import { scaleOrdinal } from "d3-scale"
import { schemeTableau10 } from "d3-scale-chromatic"
import { useMemo } from "react"

interface ErrorDistributionLegendProps {
  errorDistributionData: ErrorDistribution[]
  variant?: "card" | "popover"
}

export function ErrorDistributionLegend({
  errorDistributionData,
  variant = "card"
}: ErrorDistributionLegendProps) {
  const {
    selectedErrorValues,
    addErrorValue,
    removeErrorValue,
    selectAll,
    selectNone,
    selectDefault,
    defaultErrorValues
  } = useSelectedErrorContext()

  const defaultColorScale = useMemo(() => {
    const scale = scaleOrdinal<string, string>()
      .domain(errorDistributionData.map((d) => d.name))
      .range(schemeTableau10)
    return (name: string) => scale(name) as string
  }, [errorDistributionData])

  // Handle legend click
  const handleLegendClick = (errorValue: string) => {
    if (selectedErrorValues.includes(errorValue)) {
      removeErrorValue(errorValue)
    } else {
      addErrorValue(errorValue)
    }
  }

  // Sort error types alphabetically
  const sortedErrorTypes = [...errorDistributionData].sort((a, b) => a.name.localeCompare(b.name))

  // Check if current selection matches default selection (order-insensitive)
  const isDefaultSelected = useMemo(() => {
    if (selectedErrorValues.length !== defaultErrorValues.length) return false
    const selectedSet = new Set(selectedErrorValues)
    return defaultErrorValues.every((val) => selectedSet.has(val))
  }, [selectedErrorValues, defaultErrorValues])

  return (
    <div className={cn("flex flex-col-reverse gap-4", variant === "card" && "md:-mt-16 grow")}>
      <ScrollArea className={cn("h-80 md:pr-4", variant === "popover" && " w-64 md:w-full")}>
        <div className="space-y-2">
          <AnimatePresence>
            {sortedErrorTypes.length > 0 ? (
              sortedErrorTypes.map((item) => (
                <motion.button
                  type="button"
                  key={item.name}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md p-2 transition-colors md:p-3",
                    selectedErrorValues.includes(item.name) && "bg-muted",
                    "hover:bg-muted/50"
                  )}
                  onClick={() => handleLegendClick(item.name)}
                >
                  <div
                    className="h-2.5 w-2.5 md:h-3 md:w-3 rounded-full flex-shrink-0"
                    style={{
                      backgroundColor: defaultColorScale(item.name),
                      opacity: selectedErrorValues.includes(item.name) ? 1 : 0.3
                    }}
                  />
                  <span className="w-20 flex-1 truncate text-left text-xs md:w-auto md:text-sm">
                    {item.name}
                  </span>
                  <span className="ml-1 font-medium text-xs md:text-sm">
                    {formatNumber(item.value)}
                  </span>
                </motion.button>
              ))
            ) : (
              <div className="text-muted-foreground text-sm">No error types available</div>
            )}
          </AnimatePresence>
        </div>
      </ScrollArea>

      <div className="flex items-center justify-between md:pr-4">
        <div>
          <div className="font-medium text-sm">Error Types</div>
          <div className="text-muted-foreground text-xs">
            {selectedErrorValues.length === 0
              ? "No error types selected"
              : `${selectedErrorValues.length} of ${errorDistributionData.length} available error types selected`}
          </div>
        </div>
        <TooltipProvider>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => selectAll(errorDistributionData.map((item) => item.name))}
                  disabled={selectedErrorValues.length === errorDistributionData.length}
                  aria-label="Select All"
                >
                  <CheckSquare />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Select All</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={selectNone}
                  disabled={selectedErrorValues.length === 0}
                  aria-label="Select None"
                >
                  <Square />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Select None</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={selectDefault}
                  disabled={isDefaultSelected}
                  aria-label="Reset to Default Selection"
                >
                  <RotateCcw />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Reset to Default Selection</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
    </div>
  )
}
