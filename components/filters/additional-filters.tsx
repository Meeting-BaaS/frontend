"use client"

import { CheckboxFilter } from "@/components/filters/checkbox-filter"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"
import { filtersFields } from "@/lib/filter-options"
import { filtersSchema, type FiltersFormData } from "@/lib/schemas/filters"
import type { FilterState } from "@/lib/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { Filter, FunnelX } from "lucide-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Accordion } from "@/components/ui/accordion"

const emptyFilters = {
  platformFilters: [],
  statusFilters: [],
  userReportedErrorStatusFilters: [],
  errorCategoryFilters: [],
  errorPriorityFilters: []
}

const ACCORDION_STORAGE_KEY = "analytics-accordion-state"

interface AdditionalFiltersProps {
  filters: FilterState
  setFilters: (filters: FilterState) => void
}

const defaultAccordionValue = ["platformFilters", "statusFilters", "userReportedErrorStatusFilters"]

export function AdditionalFilters({ filters, setFilters }: AdditionalFiltersProps) {
  const [open, setOpen] = useState(false)
  const [accordionValue, setAccordionValue] = useState<string[]>(() => {
    // Initialize from localStorage if available
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(ACCORDION_STORAGE_KEY)
      try {
        return stored ? JSON.parse(stored) : defaultAccordionValue
      } catch (error) {
        console.warn("Invalid JSON in localStorage for accordion state", error)
        return defaultAccordionValue
      }
    }
    return defaultAccordionValue
  })

  // Listen for changes in other tabs
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === ACCORDION_STORAGE_KEY && e.newValue) {
        try {
          setAccordionValue(JSON.parse(e.newValue))
        } catch (error) {
          console.warn("Invalid JSON in localStorage for accordion state", error)
          // Ignore invalid JSON and keep current state
        }
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const handleAccordionChange = (value: string[]) => {
    setAccordionValue(value)
    localStorage.setItem(ACCORDION_STORAGE_KEY, JSON.stringify(value))
  }

  const form = useForm<FiltersFormData>({
    resolver: zodResolver(filtersSchema),
    defaultValues: {
      platformFilters: filters.platformFilters,
      statusFilters: filters.statusFilters,
      userReportedErrorStatusFilters: filters.userReportedErrorStatusFilters,
      errorCategoryFilters: filters.errorCategoryFilters,
      errorPriorityFilters: filters.errorPriorityFilters
    }
  })

  const onSubmit = (data: FiltersFormData) => {
    setOpen(false)
    setFilters({
      platformFilters: data.platformFilters ?? [],
      statusFilters: data.statusFilters ?? [],
      userReportedErrorStatusFilters: data.userReportedErrorStatusFilters ?? [],
      errorCategoryFilters: data.errorCategoryFilters ?? [],
      errorPriorityFilters: data.errorPriorityFilters ?? []
    })
  }

  const handleClearAll = () => {
    setOpen(false)
    form.reset(emptyFilters)
    setFilters(emptyFilters)
  }

  const isFiltered = Object.keys(filters).some((key) => {
    const filterArray = filters[key as keyof FilterState]
    return filterArray && filterArray.length > 0
  })

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="gap-2">
          {isFiltered ? <FunnelX /> : <Filter />}
          Filters
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-2xs" side="right">
        <SheetHeader className="gap-0.5">
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Select one or more filters to narrow down the results</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="pl-4">
            <ScrollArea className="h-[calc(100svh-200px)] pr-4">
              <Accordion
                type="multiple"
                value={accordionValue}
                onValueChange={handleAccordionChange}
              >
                {filtersFields.map((filter) => (
                  <FormField
                    key={filter.name}
                    control={form.control}
                    name={filter.name as keyof FiltersFormData}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <CheckboxFilter
                            options={filter.options}
                            label={filter.label}
                            name={filter.name}
                            selectedValues={field.value ?? []}
                            onFilterChange={(value) => field.onChange(value)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </Accordion>
            </ScrollArea>
            <div className="mt-6 flex justify-between gap-4 pr-4">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleClearAll}
                className="grow"
              >
                Clear All
              </Button>
              <Button type="submit" size="sm" className="grow">
                Apply Filters
              </Button>
            </div>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  )
}
