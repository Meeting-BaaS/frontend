"use client"

import {
  type ColumnDef,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { Loader2, RefreshCw } from "lucide-react"
import type { DateValueType } from "react-tailwindcss-datepicker"
import { DateRangeFilter } from "@/components/broadcasts/logs/date-range-filter"
import { PageSizeSelector } from "@/components/broadcasts/logs/page-size-selector"
import type { EmailLog } from "@/lib/broadcast-types"
import { Filters } from "@/components/broadcasts/logs/filters"
import type { FilterState } from "@/lib/filter-options"

interface DataTableProps<TData extends EmailLog, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  pageCount: number
  pageIndex: number
  pageSize: number
  onPageChange: (pageIndex: number) => void
  onPageSizeChange: (pageSize: number) => void
  isRefetching: boolean
  dateRange: DateValueType
  setDateRange: (dateRange: DateValueType) => void
  refetch: () => void
  filters: FilterState
  setFilters: (filters: FilterState) => void
}

export function LogsDataTable<TData extends EmailLog, TValue>({
  columns,
  data,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  onPageSizeChange,
  isRefetching,
  dateRange,
  setDateRange,
  refetch,
  filters,
  setFilters
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getRowId: (row: TData) => row.id.toString(),
    manualPagination: true,
    pageCount,
    state: {
      sorting,
      pagination: {
        pageIndex,
        pageSize
      }
    }
  })

  return (
    <div className="relative">
      <div className="mb-4 flex flex-col items-center justify-between gap-4 md:flex-row">
        <div className="flex w-full items-center gap-2 md:w-1/2">
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
        <div className="flex w-full items-center gap-2 md:w-1/3">
          <PageSizeSelector value={pageSize} onChange={onPageSizeChange} />
          <Filters
            filters={filters}
            setFilters={setFilters}
            pageIndex={pageIndex}
            onPageChange={onPageChange}
          />
        </div>
      </div>
      <div>
        <Table className={cn(isRefetching && "animate-pulse")}>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="bg-accent dark:bg-baas-primary-700">
                {headerGroup.headers.map((header, index) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={cn(
                        index === 0 && "rounded-tl-md",
                        index === headerGroup.headers.length - 1 && "rounded-tr-md"
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No logs found. Please try a different date range or filter.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="mt-4 flex w-full items-center justify-end gap-2 md:w-auto">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pageIndex - 1)}
          className="w-1/2 md:w-auto"
          disabled={pageIndex === 0}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(pageIndex + 1)}
          disabled={pageIndex >= pageCount - 1}
          className="w-1/2 md:w-auto"
        >
          Next
        </Button>
      </div>
    </div>
  )
}
