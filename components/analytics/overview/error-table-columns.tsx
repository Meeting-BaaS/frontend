import type { ColumnDef } from "@tanstack/react-table"
import { SortableHeader } from "@/components/ui/sortable-header"
import { getErrorMessageColor } from "@/lib/utils"
import { Badge, type badgeVariants } from "@/components/ui/badge"
import type { ErrorTableEntry } from "@/lib/types"

type Priority = "critical" | "high" | "medium" | "low"
const priorityOrder: Record<Priority, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3
}

export const errorTableColumns: ColumnDef<ErrorTableEntry>[] = [
  {
    accessorKey: "type",
    header: ({ column }) => <SortableHeader column={column} title="Error Type" />,
    cell: ({ row }) => {
      const { type, category, priority } = row.original
      return (
        <div className="flex flex-col">
          <span className="mb-1">{type}</span>
          {category && <span className="text-muted-foreground text-xs">Category: {category}</span>}
          {priority && (
            <span className="text-muted-foreground text-xs capitalize">Priority: {priority}</span>
          )}
        </div>
      )
    }
  },
  // These two columns are hidden by default
  // They are used for sorting
  {
    accessorKey: "category",
    header: "Category"
  },
  {
    accessorKey: "priority",
    header: "Priority",
    sortingFn: (rowA, rowB) => {
      const priorityA = (rowA.original.priority || "medium") as Priority
      const priorityB = (rowB.original.priority || "medium") as Priority
      return priorityOrder[priorityA] - priorityOrder[priorityB]
    }
  },
  {
    accessorKey: "message",
    header: ({ column }) => <SortableHeader column={column} title="Aggregated Error Message" />,
    cell: ({ row }) => {
      const { message, priority } = row.original
      return (
        <span className="whitespace-normal break-words text-sm">
          <span className={getErrorMessageColor(priority)}>{message}</span>
        </span>
      )
    }
  },
  {
    accessorKey: "platforms",
    header: ({ column }) => <SortableHeader column={column} title="Platform" />,
    cell: ({ row }) => {
      const { platforms } = row.original
      return (
        <div className="flex flex-wrap gap-1">
          {Object.entries(platforms).map(([platform, count]) => (
            <Badge
              className="px-2 py-0.5 text-xs capitalize"
              key={platform}
              variant={platform.toLowerCase().replace(" ", "-") as keyof typeof badgeVariants}
            >
              {platform}: {count}
            </Badge>
          ))}
        </div>
      )
    }
  },
  {
    accessorKey: "count",
    header: ({ column }) => <SortableHeader column={column} title="Count" isNumber centered />,
    cell: ({ row }) => {
      return <div className="text-center">{row.original.count}</div>
    }
  }
]
