import { keepPreviousData, useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import type { EmailLogResponse } from "@/lib/broadcast-types"
import { getEmailLogs } from "@/lib/api/broadcast-api"
import type { FilterState } from "@/lib/filter-options"

dayjs.extend(utc)

interface UseEmailLogsParams {
  offset: number
  limit: number
  startDate: Date | null
  endDate: Date | null
  filters: FilterState
}

export function useEmailLogs({ offset, limit, startDate, endDate, filters }: UseEmailLogsParams) {
  const { data, isLoading, isRefetching, refetch } = useQuery<EmailLogResponse, Error>({
    queryKey: ["email-logs", { offset, limit, startDate, endDate, filters }],
    queryFn: () => {
      const { emailIdFilters } = filters
      const queryParams = {
        offset,
        limit,
        startDate: startDate && `${dayjs(startDate).utc().format("YYYY-MM-DDTHH:mm:ss")}`,
        endDate: endDate && `${dayjs(endDate).utc().format("YYYY-MM-DDTHH:mm:ss")}`,
        ...(emailIdFilters.length && {
          emailId: filters.emailIdFilters.join(",")
        }),
        ...(filters.accountEmail && {
          accountEmail: filters.accountEmail
        })
      }

      return getEmailLogs(queryParams)
    },
    staleTime: 1000 * 60 * 15, // 15 minutes for email logs
    refetchOnMount: true,
    placeholderData: keepPreviousData,
    throwOnError: true
  })

  return {
    data,
    isLoading,
    isRefetching,
    refetch
  }
}
