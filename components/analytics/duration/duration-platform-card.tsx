"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { formatDuration, formatNumber, platformColors } from "@/lib/utils"
import { useMemo } from "react"
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  type TooltipProps as RechartsTooltipProps
} from "recharts"
import { AnimatedNumber } from "@/components/ui/animated-number"
import { motion, AnimatePresence } from "motion/react"
import type { PlatformDurationEntry } from "@/lib/types"
import { SelectedErrorBadge } from "@/components/analytics/selected-error-badge"
import { useSelectedErrorContext } from "@/hooks/use-selected-error-context"
import { getPlatformDurationData } from "@/lib/format-bot-stats"

function DurationPlatformTooltip(props: RechartsTooltipProps<number, string>) {
  const { active, payload } = props

  if (!active || !payload?.length) return null

  const data = payload[0]
  const value = Number(data.value)

  return (
    <div className="z-50 rounded-lg border bg-background p-2 shadow-sm">
      <p className="mb-2 font-medium text-sm capitalize">{data.name}</p>
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: data.payload.fill }} />
          <span className="ml-auto font-medium">{formatDuration(value)}</span>
        </div>
        <div className="text-muted-foreground text-xs">{formatNumber(data.payload.count)} bots</div>
      </div>
    </div>
  )
}

export function DurationPlatformCard() {
  const { filteredBots } = useSelectedErrorContext()

  const filteredData: PlatformDurationEntry[] = useMemo(() => {
    return getPlatformDurationData(filteredBots)
  }, [filteredBots])

  // Calculate total average duration
  const totalAverageDuration = useMemo(() => {
    const totalDuration = filteredData.reduce((sum, item) => sum + item.value * item.count, 0)
    const totalBots = filteredData.reduce((sum, item) => sum + item.count, 0)
    return totalBots > 0 ? totalDuration / totalBots : 0
  }, [filteredData])

  // Chart configuration
  const chartConfig = useMemo(() => {
    return filteredData.reduce(
      (acc, item) => {
        acc[item.name] = {
          label: item.name,
          color: platformColors[item.name as keyof typeof platformColors] || platformColors.unknown
        }
        return acc
      },
      {} as Record<string, { label: string; color: string }>
    )
  }, [filteredData])

  return (
    <Card className="dark:bg-baas-black">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Platform Duration
          <SelectedErrorBadge />
        </CardTitle>
        <CardDescription>Average duration by platform</CardDescription>
      </CardHeader>
      <CardContent>
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
                >
                  {filteredData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={
                        platformColors[entry.name as keyof typeof platformColors] ||
                        platformColors.unknown
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={DurationPlatformTooltip}
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
                  <AnimatedNumber value={Math.round(totalAverageDuration / 60)} />
                </span>
                <span className="text-muted-foreground text-sm">Average Minutes</span>
              </motion.div>
            </AnimatePresence>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
