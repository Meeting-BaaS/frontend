import type { ColumnDef } from "@tanstack/react-table"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import type { Content } from "@/lib/broadcast-types"
import { SortableHeader } from "@/components/ui/sortable-header"
import type { EmailType } from "@/lib/email-types"
import { TableActions } from "@/components/broadcasts/content/table-actions"
import { EmailIdTypeMap } from "../logs/column-helpers"

dayjs.extend(utc)

export const baseContentColumns: (
  broadcastTypes: EmailType[],
  showEditAndDelete?: boolean
) => ColumnDef<Content>[] = (broadcastTypes: EmailType[], showEditAndDelete = false) => {
  return [
    {
      accessorKey: "emailType",
      header: ({ column }) => <SortableHeader column={column} title="Email Type" />,
      cell: ({ row }) => <div>{EmailIdTypeMap[row.original.emailType]}</div>
    },
    {
      accessorKey: "contentText",
      header: ({ column }) => <SortableHeader column={column} title="Content" />,
      cell: ({ row }) => <div className="max-w-[300px] truncate">{row.original.contentText}</div>
    },
    {
      accessorKey: "name",
      header: ({ column }) => <SortableHeader column={column} title="Creator" />,
      cell: ({ row }) => <div>{row.original.name}</div>
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <SortableHeader column={column} title="Created At" isNumber />,
      cell: ({ row }) => (
        <div>{dayjs.utc(row.original.createdAt).local().format("D MMM YYYY h:mm A")}</div>
      )
    },
    {
      id: "actions",
      header: () => <div className="flex justify-center">Actions</div>,
      cell: ({ row }) => (
        <TableActions
          row={row.original}
          showEditAndDelete={showEditAndDelete}
          broadcastTypes={broadcastTypes}
        />
      )
    }
  ]
}
