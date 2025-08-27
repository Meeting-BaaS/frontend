"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { formatDuration, formatNumber } from "@/lib/utils"
import { useMemo } from "react"
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
  type TooltipProps as RechartsTooltipProps,
  CartesianGrid
} from "recharts"
import dayjs from "dayjs"
import { scaleOrdinal } from "d3-scale"
import { schemePaired } from "d3-scale-chromatic"
import type { DurationTimelineEntry } from "@/lib/types"
import { SelectedErrorBadge } from "@/components/analytics/selected-error-badge"
import { getDurationTimelineData } from "@/lib/format-bot-stats"
import { useSelectedErrorContext } from "@/hooks/use-selected-error-context"

function DurationTimelineTooltip(props: RechartsTooltipProps<number, string>) {
  const { active, payload, label } = props

  if (!active || !payload?.length) return null

  return (
    <div className="z-50 rounded-lg border bg-background p-2 shadow-sm">
      <p className="mb-2 font-medium text-sm">{dayjs(label).format("D MMM YYYY")}</p>
      <div className="space-y-1">
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 text-xs">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color as string }}
            />
            <span className="capitalize">{entry.name}</span>
            <span className="ml-auto font-medium">
              {entry.dataKey === "averageDuration"
                ? formatDuration(entry.value as number)
                : formatNumber(entry.value as number)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export function DurationTimelineCard() {
  const { filteredBots } = useSelectedErrorContext()

  const filteredData: DurationTimelineEntry[] = useMemo(() => {
    return getDurationTimelineData(filteredBots)
  }, [filteredBots])

  // Create color scale for the lines
  const colorScale = useMemo(() => {
    return scaleOrdinal().domain(["averageDuration", "botCount"]).range(schemePaired)
  }, [])

  // Chart configuration
  const chartConfig = useMemo(() => {
    return {
      averageDuration: {
        label: "Average Duration",
        color: colorScale("averageDuration") as string
      },
      botCount: { label: "Total Bots", color: colorScale("botCount") as string }
    }
  }, [colorScale])

  return (
    <Card className="dark:bg-baas-black">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Duration Timeline
          <SelectedErrorBadge />
        </CardTitle>
        <CardDescription>Average duration over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ChartContainer config={chartConfig} className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis
                  dataKey="date"
                  className="text-xs"
                  tickFormatter={(value) => dayjs(value).format("D MMM")}
                />
                <YAxis
                  yAxisId="left"
                  className="text-xs"
                  tickFormatter={formatDuration}
                  label={{
                    value: "Avg. Duration",
                    angle: -90,
                    position: "insideLeft"
                  }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  tickFormatter={formatNumber}
                  className="text-xs"
                  label={{
                    value: "Total Bots",
                    angle: 90,
                    position: "insideRight"
                  }}
                />
                <Tooltip content={DurationTimelineTooltip} cursor={false} />
                <Legend wrapperStyle={{ fontSize: "0.75rem", textTransform: "capitalize" }} />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="averageDuration"
                  stroke={chartConfig.averageDuration.color}
                  name="Average Duration"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="botCount"
                  stroke={chartConfig.botCount.color}
                  name="Total Bots"
                  strokeWidth={1.5}
                  dot={false}
                  strokeDasharray="3 3"
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
