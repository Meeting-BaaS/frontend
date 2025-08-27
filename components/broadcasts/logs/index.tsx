"use client"

import { useState, useEffect } from "react"
import { LogsDataTable } from "@/components/broadcasts/logs/table"
import { columns } from "@/components/broadcasts/logs/columns"
import { Loader2 } from "lucide-react"
import { useEmailLogs } from "@/hooks/use-email-logs"
import type { DateValueType } from "react-tailwindcss-datepicker/dist/types"
import {
  PAGE_SIZE_STORAGE_KEY,
  pageSizeOptions
} from "@/components/broadcasts/logs/page-size-selector"
import { useSearchParams, useRouter } from "next/navigation"
import { updateSearchParams, validateDateRange, validateFilterValues } from "@/lib/search-params"
import type { FilterState } from "@/lib/filter-options"

export const DEFAULT_PAGE_SIZE = pageSizeOptions[0].value

export default function LogsTable() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // Pagination state
  const [pageIndex, setPageIndex] = useState(0)
  const [pageSize, setPageSize] = useState(() => {
    // Initialize from localStorage if available, otherwise use default
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(PAGE_SIZE_STORAGE_KEY)
      return stored && pageSizeOptions.some((option) => option.value === Number(stored))
        ? Number(stored)
        : DEFAULT_PAGE_SIZE
    }
    return DEFAULT_PAGE_SIZE
  })

  // Initialize date range from URL params or default to last 14 days
  const [dateRange, setDateRange] = useState<DateValueType>(() =>
    validateDateRange(searchParams.get("startDate"), searchParams.get("endDate"))
  )

  // Initialize filters from URL params or empty arrays
  const [filters, setFilters] = useState<FilterState>(() =>
    validateFilterValues(searchParams.get("emailIdFilters"), searchParams.get("accountEmail"))
  )

  // Update URL when date range, filters, or bot UUIDs change
  useEffect(() => {
    const newParams = updateSearchParams(searchParams, dateRange, filters)
    if (newParams.toString() !== searchParams.toString()) {
      router.replace(`?${newParams.toString()}`, { scroll: false })
    }
  }, [dateRange, router, searchParams, filters])

  const { data, isLoading, isRefetching, refetch } = useEmailLogs({
    offset: pageIndex * pageSize,
    limit: pageSize,
    startDate: dateRange?.startDate ?? null,
    endDate: dateRange?.endDate ?? null,
    filters
  })

  return (
    <div className="relative">
      {/* Loading state - only show full screen loader on initial load */}
      {isLoading && !data ? (
        <div className="flex h-96 items-center justify-center">
          <Loader2 className="animate-spin text-primary" />
        </div>
      ) : (
        <LogsDataTable
          columns={columns}
          data={data?.data || []}
          pageCount={data?.hasMore ? pageIndex + 2 : pageIndex + 1}
          pageIndex={pageIndex}
          pageSize={pageSize}
          onPageChange={setPageIndex}
          onPageSizeChange={setPageSize}
          isRefetching={isRefetching}
          dateRange={dateRange}
          setDateRange={setDateRange}
          refetch={refetch}
          filters={filters}
          setFilters={setFilters}
        />
      )}
    </div>
  )
}
