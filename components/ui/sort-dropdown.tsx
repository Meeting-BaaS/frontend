import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { ChevronDown } from "lucide-react"
import type { SortingState, OnChangeFn } from "@tanstack/react-table"

interface SortDropdownProps {
  sortOptions: { label: string; value: string }[]
  sorting: SortingState
  onSortingChange: OnChangeFn<SortingState>
}

export function SortDropdown({ sortOptions, sorting, onSortingChange }: SortDropdownProps) {
  const handleValueChange = (value: string) => {
    const [id, direction] = value.split("-")
    if (id && (direction === "asc" || direction === "desc")) {
      onSortingChange([{ id, desc: direction === "desc" }])
    }
  }
  return (
    <div className="md:-mt-16 -mt-4 mb-4 flex items-center justify-end md:mb-8">
      <div>
        <span className="mr-2 text-muted-foreground text-sm">Sort by:</span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="md:ml-auto">
              {sorting.length > 0 && sorting[0]?.id
                ? sortOptions.find(
                    (opt) => opt.value === `${sorting[0].id}-${sorting[0].desc ? "desc" : "asc"}`
                  )?.label || "Default Sort"
                : "Default Sort"}
              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuRadioGroup
              value={
                sorting.length > 0 && sorting[0]?.id
                  ? `${sorting[0].id}-${sorting[0].desc ? "desc" : "asc"}`
                  : undefined
              }
              onValueChange={handleValueChange}
            >
              {sortOptions.map((option) => (
                <DropdownMenuRadioItem key={option.value} value={option.value}>
                  {option.label}
                </DropdownMenuRadioItem>
              ))}
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
