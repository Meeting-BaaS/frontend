import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts"
import type { TooltipProps as RechartsTooltipProps } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { formatFloat } from "@/lib/utils"
import type { ConsumptionChartData } from "@/lib/types"
import dayjs from "dayjs"
import { schemeTableau10 } from "d3-scale-chromatic"

const chartConfig = {
  recording: {
    label: "Recording",
    color: schemeTableau10[0]
  },
  transcription: {
    label: "Transcription",
    color: schemeTableau10[1]
  },
  streaming: {
    label: "Streaming",
    color: schemeTableau10[2]
  }
} as const

interface TokenUsageChartProps {
  data: ConsumptionChartData[]
}

function TokenUsageTooltip(props: RechartsTooltipProps<number, string>) {
  const { active, payload, label } = props

  if (!active || !payload?.length || !label) return null

  const total = payload.reduce((sum, item) => {
    const value = Number(item.value) || 0
    return sum + value
  }, 0)

  return (
    <div className="rounded-lg border bg-background p-2 shadow-sm">
      <p className="mb-2 font-medium text-sm">{dayjs(label).format("D MMM YYYY")}</p>
      <div className="space-y-1">
        {payload.map((item, index) => {
          const key = item.dataKey as keyof typeof chartConfig
          const chartItem = chartConfig[key]
          return (
            <div key={`item-${index}`} className="flex items-center gap-2 text-xs">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: chartItem?.color || item.color }}
              />
              <span>{chartItem?.label || key}</span>
              <span className="ml-auto font-medium">{formatFloat(Number(item.value))}</span>
            </div>
          )
        })}
        <div className="mt-2 border-t pt-1">
          <div className="flex items-center justify-between font-medium text-xs">
            <span>Total</span>
            <span>{formatFloat(total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function TokenUsageChart({ data }: TokenUsageChartProps) {
  return (
    <div className="h-[400px]">
      <ChartContainer config={chartConfig} className="h-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis
              dataKey="date"
              className="text-xs"
              tickFormatter={(date) => dayjs(date).format("D MMM")}
            />
            <YAxis className="text-xs" />
            <Tooltip
              content={TokenUsageTooltip}
              cursor={false}
              wrapperStyle={{ outline: "none" }}
            />
            <Legend wrapperStyle={{ fontSize: "0.75rem", textTransform: "capitalize" }} />
            <Line
              type="monotone"
              dataKey="recording"
              stroke={schemeTableau10[0]}
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="transcription"
              stroke={schemeTableau10[1]}
              strokeWidth={2}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="streaming"
              stroke={schemeTableau10[2]}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartContainer>
    </div>
  )
}
