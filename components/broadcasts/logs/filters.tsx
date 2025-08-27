"use client"

import { CheckboxFilter } from "@/components/broadcasts/logs/checkbox-filter"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"
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
import type { FilterState } from "@/lib/filter-options"
import { zodResolver } from "@hookform/resolvers/zod"
import { Filter, FunnelX } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import isEqual from "lodash-es/isEqual"

const emptyFilters = {
  emailIdFilters: [],
  accountEmail: ""
}

interface FiltersProps {
  filters: FilterState
  setFilters: (filters: FilterState) => void
  pageIndex: number
  onPageChange: (pageIndex: number) => void
}

export function Filters({ filters, setFilters, pageIndex, onPageChange }: FiltersProps) {
  const [open, setOpen] = useState(false)

  const form = useForm<FiltersFormData>({
    resolver: zodResolver(filtersSchema),
    defaultValues: {
      emailIdFilters: filters.emailIdFilters,
      accountEmail: filters.accountEmail
    }
  })

  const resetPageIndex = () => {
    // Reset the page index to 0 when the filters change
    if (pageIndex !== 0) {
      onPageChange(0)
    }
  }

  const onSubmit = (data: FiltersFormData) => {
    setOpen(false)
    if (isEqual(data, filters)) {
      return
    }
    resetPageIndex()
    setFilters({
      emailIdFilters: data.emailIdFilters ?? [],
      accountEmail: data.accountEmail ?? ""
    })
  }

  const handleClearAll = () => {
    setOpen(false)
    if (isEqual(emptyFilters, filters)) {
      return
    }
    resetPageIndex()
    form.reset(emptyFilters)
    setFilters(emptyFilters)
  }

  const isFiltered = Object.keys(filters).some((key) => {
    const filterArray = filters[key as keyof FilterState]
    if (Array.isArray(filterArray)) {
      return filterArray.length > 0
    }
    return filterArray !== ""
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
          <form onSubmit={form.handleSubmit(onSubmit)} className="pl-4" noValidate>
            <ScrollArea className="h-[calc(100svh-200px)] pr-4">
              <FormField
                control={form.control}
                name="accountEmail"
                render={({ field }) => (
                  <FormItem className="mb-4">
                    <FormLabel className="text-muted-foreground text-sm">Account Email</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" placeholder="Email" autoComplete="off" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                          selectedValues={Array.isArray(field.value) ? field.value : []}
                          onFilterChange={(value) => field.onChange(value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
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
