"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { formatNumber } from "@/lib/utils"
import dayjs from "dayjs"
import { useMemo } from "react"
import {
  Line,
  LineChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  type TooltipProps as RechartsTooltipProps,
  Legend
} from "recharts"
import type { IssueReportTimelineEntry } from "@/lib/types"

interface IssueTimelineCardProps {
  timelineData: IssueReportTimelineEntry[]
  statusColors: {
    open: string
    in_progress: string
    closed: string
  }
}

export function IssueTimelineCard({ timelineData, statusColors }: IssueTimelineCardProps) {
  // Chart configuration
  const chartConfig = useMemo(() => {
    return {
      open: {
        label: "Open",
        color: statusColors.open
      },
      in_progress: {
        label: "In Progress",
        color: statusColors.in_progress
      },
      closed: {
        label: "Closed",
        color: statusColors.closed
      }
    }
  }, [statusColors])

  function IssueTimelineTooltip(props: RechartsTooltipProps<number, string>) {
    const { active, payload } = props

    if (!active || !payload?.length) return null

    const firstPayload = payload[0]
    if (!firstPayload?.payload?.date) return null

    return (
      <div className="z-50 rounded-lg border bg-background p-2 shadow-sm">
        <p className="mb-2 font-medium text-sm">
          {dayjs(firstPayload.payload.date).format("D MMM YYYY")}
        </p>
        <div className="space-y-1">
          {payload.map((entry) => (
            <div key={entry.name} className="flex items-center gap-2 text-xs">
              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
              <span className="capitalize">{entry.name?.replace(/_/g, " ") || "Unknown"}</span>
              <span className="ml-auto font-medium">{formatNumber(entry.value as number)}</span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <Card className="dark:bg-baas-black">
      <CardHeader>
        <CardTitle>Issue Timeline</CardTitle>
        <CardDescription>Trend of reported issues over time</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-80">
          <ChartContainer config={chartConfig} className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="date"
                  className="text-xs"
                  tickFormatter={(value) => dayjs(value).format("D MMM")}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  className="text-xs"
                  tickFormatter={(value) => formatNumber(value)}
                />
                <Tooltip
                  content={IssueTimelineTooltip}
                  cursor={false}
                  wrapperStyle={{ outline: "none", zIndex: 10 }}
                />
                <Legend
                  formatter={(value) => value.replace(/_/g, " ")}
                  wrapperStyle={{ fontSize: "0.75rem", textTransform: "capitalize" }}
                />
                <Line
                  type="monotone"
                  dataKey="open"
                  stroke={statusColors.open}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="in_progress"
                  stroke={statusColors.in_progress}
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="closed"
                  stroke={statusColors.closed}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
