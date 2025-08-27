"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { formatNumber } from "@/lib/utils"
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
import { scaleOrdinal } from "d3-scale"
import { schemeTableau10 } from "d3-scale-chromatic"
import dayjs from "dayjs"
import type { TimelineEntry } from "@/lib/types"
import { useSelectedErrorContext } from "@/hooks/use-selected-error-context"
import { getTimelineData } from "@/lib/format-bot-stats"
import { SelectedErrorBadge } from "@/components/analytics/selected-error-badge"

function ErrorTimelineTooltip(props: RechartsTooltipProps<number, string>) {
  const { active, payload, label } = props

  if (!active || !payload?.length) return null

  // Filter out the total line from the main entries
  const priorityEntries = payload.filter((entry) => entry.name !== "Total")
  const totalEntry = payload.find((entry) => entry.name === "Total")

  return (
    <div className="z-50 rounded-lg border bg-background p-2 shadow-sm">
      <p className="mb-2 font-medium text-sm">{dayjs(label).format("D MMM YYYY")}</p>
      <div className="space-y-1">
        {priorityEntries.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 text-xs">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: entry.color as string }}
            />
            <span className="capitalize">{entry.name}</span>
            <span className="ml-auto font-medium">{formatNumber(entry.value as number)}</span>
          </div>
        ))}
        <div className="mt-1 border-t pt-1">
          <div className="flex items-center gap-2 text-xs">
            <div
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: "var(--destructive)" }}
            />
            <span className="capitalize">Total</span>
            <span className="ml-auto font-medium">
              {formatNumber((totalEntry?.value as number) || 0)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ErrorTimelineCard() {
  const { filteredBots } = useSelectedErrorContext()

  const filteredData: TimelineEntry[] = useMemo(() => {
    return getTimelineData(filteredBots)
  }, [filteredBots])

  // Get all unique priorities from the timeline data
  const priorities = useMemo(() => {
    const uniquePriorities = new Set<string>()
    for (const day of filteredData) {
      for (const { priority } of day.priorities) {
        uniquePriorities.add(priority)
      }
    }
    return Array.from(uniquePriorities)
  }, [filteredData])

  // Create a color scale for priorities
  const colorScale = useMemo(() => {
    return scaleOrdinal().domain(priorities).range(schemeTableau10)
  }, [priorities])

  // Chart configuration
  const chartConfig = useMemo(() => {
    return priorities.reduce(
      (acc, priority) => {
        acc[priority] = {
          label: priority,
          color: colorScale(priority) as string
        }
        return acc
      },
      {} as Record<string, { label: string; color: string }>
    )
  }, [priorities, colorScale])

  // Transform data for the chart
  const chartData = useMemo(() => {
    return filteredData.map((day) => {
      const transformedDay: Record<string, number | string> = {
        date: day.date,
        total: day.total
      }

      // Add each priority count
      for (const { priority, count } of day.priorities) {
        transformedDay[priority] = count
      }

      return transformedDay
    })
  }, [filteredData])

  return (
    <Card className="dark:bg-baas-black">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Error Timeline
          <SelectedErrorBadge />
        </CardTitle>
        <CardDescription className="-mt-1.5">Error trends by priority over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ChartContainer config={chartConfig} className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => dayjs(value).format("D MMM")}
                  className="text-xs"
                />
                <YAxis tickFormatter={(value) => formatNumber(value)} className="text-xs" />
                <Tooltip content={ErrorTimelineTooltip} cursor={false} />
                <Legend wrapperStyle={{ fontSize: "0.75rem", textTransform: "capitalize" }} />
                {/* Total line */}
                <Line
                  type="monotone"
                  dataKey="total"
                  stroke="var(--destructive)"
                  name="Total"
                  strokeWidth={2}
                  dot={false}
                />
                {/* Priority lines */}
                {Object.entries(chartConfig).map(([priority, { color }]) => (
                  <Line
                    key={priority}
                    type="monotone"
                    dataKey={priority}
                    stroke={color}
                    name={priority}
                    strokeWidth={1.5}
                    dot={false}
                    strokeDasharray="3 3"
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
