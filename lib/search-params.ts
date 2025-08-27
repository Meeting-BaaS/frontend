import { accountEmailSchema } from "./schemas/filters"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import type { DateValueType } from "react-tailwindcss-datepicker/dist/types"
import type { FilterState } from "@/lib/filter-options"
import { allEmailTypes } from "@/lib/filter-options"

dayjs.extend(utc)

// Helper function to find option by searchParam
const findOptionBySearchParam = <T extends { searchParam: string; value: string }>(
  options: T[],
  searchParam: string
): string | undefined => options.find((opt) => opt.searchParam === searchParam)?.value

// Helper function to get searchParam from value
const getSearchParamFromValue = <T extends { searchParam: string; value: string }>(
  options: T[],
  value: string
): string | undefined => options.find((opt) => opt.value === value)?.searchParam

// Validate and parse filter values from search params
export function validateFilterValues(
  emailIdFilters: string | null,
  accountEmail: string | null
): FilterState {
  const validEmailIdFilters =
    emailIdFilters
      ?.split(",")
      .map((value) => findOptionBySearchParam(allEmailTypes, value))
      .filter((value): value is string => value !== undefined) ?? []

  const validAccountEmail =
    accountEmail && accountEmailSchema.safeParse(accountEmail).success ? accountEmail : ""

  return {
    emailIdFilters: validEmailIdFilters,
    accountEmail: validAccountEmail
  }
}

// Convert filter state to URL-safe values
export function filterStateToSearchValues(filters: FilterState): {
  emailIdFilters: string[]
  accountEmail: string
} {
  return {
    emailIdFilters: filters.emailIdFilters
      .map((value) => getSearchParamFromValue(allEmailTypes, value))
      .filter((value): value is string => value !== undefined),
    accountEmail: filters.accountEmail
  }
}

// Validate and parse date from search params
export function validateDate(dateStr: string | null): Date | null {
  if (!dateStr) return null

  const date = dayjs.utc(dateStr)
  return date.isValid() ? date.toDate() : null
}

// Validate and parse date range from search params
export function validateDateRange(startDate: string | null, endDate: string | null): DateValueType {
  const validStartDate = validateDate(startDate)
  const validEndDate = validateDate(endDate)

  // Only use dates if both are valid and in correct order
  if (validStartDate && validEndDate && dayjs(validStartDate).isBefore(validEndDate)) {
    return {
      startDate: validStartDate,
      endDate: validEndDate
    }
  }

  // If either date is invalid or dates are in wrong order, use defaults
  return {
    startDate: dayjs().subtract(14, "day").startOf("day").toDate(),
    endDate: dayjs().endOf("day").toDate()
  }
}

// Convert date to UTC string for URL
export function dateToUtcString(date: Date | null): string | null {
  if (!date) return null
  return dayjs(date).utc().format()
}

export function updateDateRangeSearchParams(
  currentParams: URLSearchParams,
  dateRange: DateValueType
): URLSearchParams {
  const newParams = new URLSearchParams(currentParams.toString())

  // Update date range params. Only set if both dates are valid.
  const startDateUtc = dateToUtcString(dateRange?.startDate ?? null)
  const endDateUtc = dateToUtcString(dateRange?.endDate ?? null)
  if (startDateUtc && endDateUtc) {
    newParams.set("startDate", startDateUtc)
    newParams.set("endDate", endDateUtc)
  } else {
    newParams.delete("startDate")
    newParams.delete("endDate")
  }

  return newParams
}

// Update URL search params with all filter values
export function updateSearchParams(
  currentParams: URLSearchParams,
  dateRange: DateValueType,
  filters: FilterState
): URLSearchParams {
  const params = updateDateRangeSearchParams(currentParams, dateRange)
  const searchValues = filterStateToSearchValues(filters)

  if (searchValues.emailIdFilters.length > 0) {
    params.set("emailIdFilters", searchValues.emailIdFilters.join(","))
  } else {
    params.delete("emailIdFilters")
  }

  if (searchValues.accountEmail) {
    params.set("accountEmail", searchValues.accountEmail)
  } else {
    params.delete("accountEmail")
  }

  return params
}
