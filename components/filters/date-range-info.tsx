import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import { Skeleton } from "@/components/ui/skeleton"

dayjs.extend(utc)

interface DateRangeInfoProps {
  firstBotDate: string
  lastBotDate: string
  isRefetching: boolean
  totalBots?: number
}

export function DateRangeInfo({
  firstBotDate,
  lastBotDate,
  isRefetching,
  totalBots
}: DateRangeInfoProps) {
  if (isRefetching) {
    return <Skeleton className="h-5 w-full max-w-96" />
  }
  return (
    <div className="text-muted-foreground text-sm">
      Results from {totalBots ?? 0} bots between{" "}
      {dayjs(lastBotDate).utc().local().format("D MMM YYYY")} to{" "}
      {dayjs(firstBotDate).utc().local().format("D MMM YYYY")}
    </div>
  )
}
