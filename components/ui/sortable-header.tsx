import type { Column } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { SortIcon } from "@/components/ui/sort-icon"
import { cn } from "@/lib/utils"

const sortButtonClasses = "p-0 hover:bg-transparent dark:hover:bg-transparent"

export function SortableHeader({
  column,
  title,
  isNumber,
  centered = false
}: {
  column: Column<any, any>
  title: string
  isNumber?: boolean
  centered?: boolean
}) {
  return (
    <div
      className={cn("flex justify-start", centered && "justify-center")}
      aria-sort={column.getIsSorted() ? (column.getIsSorted() === "asc" ? "ascending" : "descending") : "none"}
    >
      <Button
        variant="ghost"
        className={sortButtonClasses}
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        type="button"
        aria-label={`Sort by ${title}`}
      >
        {title}
        <SortIcon isSorted={column.getIsSorted()} isNumber={isNumber} />
      </Button>
    </div>
  )
}
