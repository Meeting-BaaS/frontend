import { AdditionalFilters } from "@/components/filters/additional-filters"
import { DateRangeFilter } from "@/components/filters/date-range-filter"
import { DateRangeInfo } from "@/components/filters/date-range-info"
import type { FilterState } from "@/lib/types"
import { Loader2, RefreshCw } from "lucide-react"
import type { DateRangeType } from "react-tailwindcss-datepicker"
import { LimitSelector } from "@/components/filters/limit-selector"
import { Button } from "@/components/ui/button"

interface FiltersProps {
  filters: FilterState
  setFilters: (filters: FilterState) => void
  dateRange: DateRangeType | null
  setDateRange: (dateRange: DateRangeType | null) => void
  limit: number
  setLimit: (limit: number) => void
  refetch: () => void
  isRefetching: boolean
  firstBotDate?: string
  lastBotDate?: string
  totalBots?: number
}

export default function Filters({
  filters,
  setFilters,
  dateRange,
  setDateRange,
  limit,
  setLimit,
  refetch,
  isRefetching,
  firstBotDate,
  lastBotDate,
  totalBots
}: FiltersProps) {
  return (
    <div className="my-4 flex flex-col justify-between gap-4 md:flex-row">
      <div className="flex w-full flex-col gap-2 md:w-1/2">
        <div className="flex items-center gap-2">
          <DateRangeFilter value={dateRange} onChange={setDateRange} />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => refetch()}
            disabled={isRefetching}
            aria-label={isRefetching ? "Refreshing data" : "Refresh data"}
          >
            {isRefetching ? <Loader2 className="animate-spin text-primary" /> : <RefreshCw />}
          </Button>
        </div>
        {firstBotDate && lastBotDate && (
          <DateRangeInfo
            firstBotDate={firstBotDate}
            lastBotDate={lastBotDate}
            isRefetching={isRefetching}
            totalBots={totalBots}
          />
        )}
      </div>
      <div className="flex w-full items-center gap-2 md:w-1/3 lg:w-1/4 xl:w-1/5">
        <LimitSelector value={limit} onChange={setLimit} />
        <AdditionalFilters filters={filters} setFilters={setFilters} />
      </div>
    </div>
  )
}
