"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { formatNumber, formatPercentage } from "@/lib/utils"
import { useMemo, useState, useEffect, useCallback } from "react"
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  type TooltipProps as RechartsTooltipProps
} from "recharts"
import { scaleOrdinal } from "d3-scale"
import { schemeTableau10 } from "d3-scale-chromatic"
import { motion, AnimatePresence } from "motion/react"
import { AnimatedNumber } from "@/components/ui/animated-number"
import type { ErrorDistribution } from "@/lib/types"
import { useSelectedErrorContext } from "@/hooks/use-selected-error-context"
import { useSelectedBots } from "@/hooks/use-selected-bots"
import type { FormattedBotData } from "@/lib/types"
import { debounce } from "lodash-es"
import { ErrorDistributionLegend } from "@/components/analytics/error-distribution-legend"

interface ErrorDistributionCardProps {
  errorDistributionData: ErrorDistribution[]
  totalErrors: number
}

function ErrorDistributionTooltip(props: RechartsTooltipProps<number, string>) {
  const { active, payload } = props

  if (!active || !payload?.length) return null

  const data = payload[0]
  const value = Number(data.value)

  return (
    <div className="z-50 rounded-lg border bg-background p-2 shadow-sm">
      <p className="mb-2 font-medium text-sm">{data.name}</p>
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: data.payload.fill }} />
          <span className="ml-auto font-medium">
            {formatNumber(value)} ({formatPercentage(data.payload.percentage)})
          </span>
        </div>
      </div>
    </div>
  )
}

export function ErrorDistributionCard({
  errorDistributionData,
  totalErrors
}: ErrorDistributionCardProps) {
  const { selectedErrorValues, filteredBots } = useSelectedErrorContext()
  const { setHoveredBots, selectBotsByCategory } = useSelectedBots()
  const [filteredData, setFilteredData] = useState(errorDistributionData)
  const [filteredTotal, setFilteredTotal] = useState(totalErrors)

  // Memoize bots by error type for better performance
  const botsByErrorType = useMemo(() => {
    return filteredBots.reduce(
      (acc, bot) => {
        const errorType = bot.status.value
        if (!acc[errorType]) {
          acc[errorType] = []
        }
        acc[errorType].push(bot)
        return acc
      },
      {} as Record<string, FormattedBotData[]>
    )
  }, [filteredBots])

  // Debounced hover handler to prevent rapid state updates
  const debouncedSetHoveredBots = useMemo(
    () => debounce((bots: FormattedBotData[]) => setHoveredBots(bots), 100),
    [setHoveredBots]
  )

  // Handle cell hover
  const handleCellHover = useCallback(
    (entry: ErrorDistribution) => {
      const botsWithError = botsByErrorType[entry.name] || []
      if (botsWithError.length > 0) {
        debouncedSetHoveredBots(botsWithError)
      }
    },
    [botsByErrorType, debouncedSetHoveredBots]
  )

  // Handle cell leave
  const handleCellLeave = useCallback(() => {
    debouncedSetHoveredBots([])
  }, [debouncedSetHoveredBots])

  // Handle cell click
  const handleCellClick = useCallback(
    (entry: ErrorDistribution) => {
      const botsWithError = botsByErrorType[entry.name] || []
      if (botsWithError.length > 0) {
        selectBotsByCategory(botsWithError)
      }
    },
    [botsByErrorType, selectBotsByCategory]
  )

  // Cleanup debounced function on unmount
  useEffect(() => {
    return () => {
      debouncedSetHoveredBots.cancel()
    }
  }, [debouncedSetHoveredBots])

  // Update filtered data when selection changes or new data arrives
  useEffect(() => {
    // If we have no valid selections, show no data
    if (selectedErrorValues.length === 0) {
      setFilteredData([])
      setFilteredTotal(0)
      return
    }

    // Filter the data based on valid selections
    const filtered = errorDistributionData.filter((item) => selectedErrorValues.includes(item.name))
    setFilteredData(filtered)
    setFilteredTotal(filtered.reduce((sum, item) => sum + item.value, 0))
  }, [errorDistributionData, selectedErrorValues])

  // Create a color scale based on the number of error types
  const colorScale = useMemo(() => {
    return scaleOrdinal()
      .domain(errorDistributionData.map((d) => d.name))
      .range(schemeTableau10)
  }, [errorDistributionData])

  // Chart configuration
  const chartConfig = useMemo(() => {
    return errorDistributionData.reduce(
      (acc, item) => {
        acc[item.name] = {
          label: item.name,
          color: colorScale(item.name) as string
        }
        return acc
      },
      {} as Record<string, { label: string; color: string }>
    )
  }, [errorDistributionData, colorScale])

  return (
    <Card className="dark:bg-baas-black">
      <CardHeader>
        <CardTitle>Error Type Summary</CardTitle>
        <CardDescription>Distribution of errors by type</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-8 md:flex-row">
          {/* Donut Chart */}
          <div className="w-full md:w-1/2">
            <div className="relative h-80">
              <ChartContainer config={chartConfig} className="h-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={filteredData}
                      cx="50%"
                      cy="50%"
                      innerRadius={90}
                      outerRadius={120}
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                      strokeWidth={0}
                      animationDuration={800}
                      onMouseEnter={(data) => handleCellHover(data)}
                      onMouseLeave={handleCellLeave}
                      className="cursor-pointer"
                      onClick={(data) => handleCellClick(data)}
                    >
                      {filteredData.map((entry) => (
                        <Cell key={entry.name} fill={colorScale(entry.name) as string} />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      content={ErrorDistributionTooltip}
                      cursor={false}
                      wrapperStyle={{ outline: "none", zIndex: 10 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <AnimatePresence>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4, delay: 1.2, ease: "easeInOut" }}
                    className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center"
                  >
                    <span className="font-bold text-4xl">
                      <AnimatedNumber value={filteredTotal} />
                    </span>
                    <span className="text-muted-foreground text-sm">Errors</span>
                  </motion.div>
                </AnimatePresence>
              </ChartContainer>
            </div>
          </div>
          <ErrorDistributionLegend errorDistributionData={errorDistributionData} variant="card" />
        </div>
      </CardContent>
    </Card>
  )
}
