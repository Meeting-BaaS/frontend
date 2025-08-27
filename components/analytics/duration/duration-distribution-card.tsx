"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { formatNumber } from "@/lib/utils"
import { useMemo } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps as RechartsTooltipProps
} from "recharts"
import { type ScaleOrdinal, scaleOrdinal } from "d3-scale"
import { schemeTableau10 } from "d3-scale-chromatic"
import type { DurationDistributionEntry } from "@/lib/types"
import { SelectedErrorBadge } from "@/components/analytics/selected-error-badge"
import { useSelectedErrorContext } from "@/hooks/use-selected-error-context"
import { getDurationDistributionData } from "@/lib/format-bot-stats"

function DurationDistributionTooltip(
  props: RechartsTooltipProps<number, string>,
  distributionData: DurationDistributionEntry[],
  colorScale: ScaleOrdinal<string, string>
) {
  const { active, payload } = props

  if (!active || !payload?.length) return null

  const data = payload[0]
  const percentage = (
    (data.payload.count / distributionData.reduce((sum, item) => sum + item.count, 0)) *
    100
  ).toFixed(1)

  return (
    <div className="z-50 rounded-lg border bg-background p-2 shadow-sm">
      <p className="mb-2 font-medium text-sm">{data.payload.range}</p>
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs">
          <div
            className="h-2 w-2 rounded-full"
            style={{ backgroundColor: colorScale(data.payload.range) as string }}
          />
          <span className="ml-auto font-medium">{formatNumber(data.payload.count)} bots</span>
        </div>
        <div className="text-muted-foreground text-xs">{percentage}% of total</div>
      </div>
    </div>
  )
}

export function DurationDistributionCard() {
  const { filteredBots } = useSelectedErrorContext()

  const filteredData: DurationDistributionEntry[] = useMemo(() => {
    return getDurationDistributionData(filteredBots)
  }, [filteredBots])

  const colorScale = useMemo(() => {
    return scaleOrdinal<string, string>()
      .domain(filteredData.map((d) => d.range))
      .range(schemeTableau10)
  }, [filteredData])

  const chartConfig = useMemo(() => {
    return filteredData.reduce(
      (acc, item) => {
        acc[item.range] = {
          label: item.range,
          color: colorScale(item.range) as string
        }
        return acc
      },
      {} as Record<string, { label: string; color: string }>
    )
  }, [filteredData, colorScale])

  return (
    <Card className="dark:bg-baas-black">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Duration Distribution
          <SelectedErrorBadge />
        </CardTitle>
        <CardDescription>Distribution of bot durations</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-80">
          <ChartContainer config={chartConfig} className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="range"
                  tickLine={false}
                  axisLine={false}
                  className="text-xs"
                  tick={{ fill: "currentColor" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  className="text-xs"
                  tick={{ fill: "currentColor" }}
                  tickFormatter={(value) => formatNumber(value)}
                />
                <Tooltip
                  content={(props: RechartsTooltipProps<number, string>) =>
                    DurationDistributionTooltip(props, filteredData, colorScale)
                  }
                  cursor={false}
                  wrapperStyle={{ outline: "none", zIndex: 10 }}
                />
                <Bar
                  dataKey="count"
                  fill="currentColor"
                  radius={[4, 4, 0, 0]}
                  animationDuration={800}
                >
                  {filteredData.map((entry) => (
                    <Cell key={entry.range} fill={colorScale(entry.range) as string} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
