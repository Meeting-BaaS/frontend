"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer } from "@/components/ui/chart"
import { cn, formatNumber, formatPercentage, platformGradients } from "@/lib/utils"
import { useMemo } from "react"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  type TooltipProps as RechartsTooltipProps,
  XAxis,
  Cell,
  LabelList,
  type LabelProps,
  YAxis
} from "recharts"
import { AnimatedNumber } from "@/components/ui/animated-number"
import type { PlatformDistribution } from "@/lib/types"

interface PlatformDistributionCardProps {
  platformDistribution: PlatformDistribution[]
  totalBots: number
}

function PlatformDistributionTooltip(props: RechartsTooltipProps<number, string>) {
  const { active, payload } = props

  if (!active || !payload?.length) return null

  const data = payload[0]
  const value = Number(data.payload.count)
  const percentage = (value / data.payload.totalBots) * 100
  const platformName = data.payload.platform
    ?.toLowerCase()
    .replace(/\s+/g, "-") as keyof typeof platformGradients

  // Ensure we have a valid platform name
  if (!platformName || !platformGradients[platformName]) return null

  return (
    <div className="z-50 rounded-lg border bg-background p-2 shadow-sm">
      <p className="mb-2 font-medium text-sm capitalize">{data.payload.platform}</p>
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-xs">
          <div
            className="h-2 w-2 rounded-full"
            style={{
              background: `linear-gradient(45deg, ${platformGradients[platformName].start}, ${platformGradients[platformName].middle}, ${platformGradients[platformName].end})`
            }}
          />
          <span className="ml-auto font-medium">
            {formatNumber(value)} ({formatPercentage(percentage)})
          </span>
        </div>
      </div>
    </div>
  )
}

export function PlatformDistributionCard({
  platformDistribution,
  totalBots
}: PlatformDistributionCardProps) {
  const chartData = useMemo(() => {
    return platformDistribution
      .map((item) => ({
        ...item,
        totalBots
      }))
      .sort((a, b) => b.count - a.count)
  }, [platformDistribution, totalBots])

  // Create chart configuration
  const chartConfig = useMemo(() => {
    return platformDistribution.reduce(
      (acc, item) => {
        acc[item.platform] = {
          label: item.platform,
          color: `url(#gradient-${item.platform.toLowerCase().replace(/\s+/g, "-")})`
        }
        return acc
      },
      {} as Record<string, { label: string; color: string }>
    )
  }, [platformDistribution])

  const CustomLabel = (props: LabelProps) => {
    const { x, y, value } = props
    if (typeof x !== "number" || typeof y !== "number" || typeof value !== "string") return null

    return (
      <text x={x} y={y + 25} className="fill-foreground text-sm capitalize">
        {value}
      </text>
    )
  }

  return (
    <Card className="w-full md:w-1/2 dark:bg-baas-black">
      <CardHeader>
        <CardTitle>Platform Distribution</CardTitle>
        <CardDescription>All bots across each platform</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-64">
          <ChartContainer config={chartConfig} className="h-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ right: 60 }}>
                <defs>
                  {chartData.map((entry) => {
                    const platform = entry.platform
                      .toLowerCase()
                      .replace(/\s+/g, "-") as keyof typeof platformGradients
                    const gradient = platformGradients[platform]
                    return (
                      <linearGradient
                        key={`gradient-${platform}`}
                        id={`gradient-${platform}`}
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="0"
                      >
                        <stop offset="0%" stopColor={gradient.start} />
                        <stop offset="50%" stopColor={gradient.middle} />
                        <stop offset="100%" stopColor={gradient.end} />
                      </linearGradient>
                    )
                  })}
                </defs>
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="platform" hide />
                <Tooltip
                  content={PlatformDistributionTooltip}
                  cursor={false}
                  wrapperStyle={{ outline: "none" }}
                />
                <Bar
                  dataKey="count"
                  radius={[4, 4, 4, 4]}
                  animationDuration={400}
                  animationEasing="ease-in-out"
                  barSize={8}
                >
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.platform}
                      fill={`url(#gradient-${entry.platform.toLowerCase().replace(/\s+/g, "-")})`}
                    />
                  ))}
                  <LabelList dataKey="platform" content={CustomLabel} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
          <div className="absolute top-0 right-0 flex h-full flex-col justify-between pt-4.5 pr-2 pb-4.5">
            {chartData.map((entry) => (
              <div
                key={entry.platform}
                className={cn(
                  "flex h-7 items-center font-bold text-lg",
                  chartData.length === 1 && "h-full",
                  chartData.length === 2 && "h-24",
                  chartData.length === 3 && "h-12"
                )}
              >
                <AnimatedNumber value={entry.count} />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
