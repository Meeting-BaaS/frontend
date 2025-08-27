"use client"

import type { ColumnDef } from "@tanstack/react-table"
import type { EmailLog } from "@/lib/broadcast-types"

import { SortableHeader } from "@/components/ui/sortable-header"
import { CopyTooltip } from "@/components/broadcasts/logs/copy-tooltip"
import { formatSentAt } from "@/lib/utils"
import { dateSort, EmailIdTypeMap } from "@/components/broadcasts/logs/column-helpers"

export const columns: ColumnDef<EmailLog>[] = [
  {
    id: "sentAt",
    meta: { displayName: "Sent At" },
    header: ({ column }) => <SortableHeader column={column} title="Sent At" isNumber />,
    accessorFn: (row) => formatSentAt(row.sentAt),
    cell: ({ row, getValue }) => (
      <CopyTooltip
        text={row.original.sentAt}
        copyText="Copy UTC timestamp"
        className="first-letter:capitalize"
      >
        <span>{getValue<string>()}</span>
      </CopyTooltip>
    ),
    sortingFn: dateSort
  },
  {
    id: "emailType",
    accessorKey: "emailType",
    meta: { displayName: "Email Type" },
    header: ({ column }) => <SortableHeader column={column} title="Email Type" />,
    cell: ({ row }) => {
      const emailType = EmailIdTypeMap[row.original.emailType]
      if (!emailType) return <span className="text-muted-foreground text-xs">N/A</span>
      return <span>{emailType}</span>
    }
  },
  {
    id: "subject",
    accessorKey: "subject",
    meta: { displayName: "Subject" },
    header: ({ column }) => <SortableHeader column={column} title="Subject" />,
    cell: ({ row }) => {
      const subject = row.original.subject
      if (!subject) return <span className="text-muted-foreground text-xs">N/A</span>
      const truncated = subject.length > 30 ? `${subject.slice(0, 27)}...` : subject
      return (
        <CopyTooltip text={subject} copyText="Copy subject">
          {truncated}
        </CopyTooltip>
      )
    }
  },
  {
    id: "email",
    accessorKey: "email",
    meta: { displayName: "Email" },
    header: ({ column }) => <SortableHeader column={column} title="Email" />,
    cell: ({ row }) => {
      const email = row.original.email
      return (
        <CopyTooltip text={email} copyText="Copy email">
          {email}
        </CopyTooltip>
      )
    }
  },
  {
    id: "fullName",
    accessorKey: "fullName",
    meta: { displayName: "Name" },
    header: ({ column }) => <SortableHeader column={column} title="Name" />,
    cell: ({ row }) => {
      const fullName = row.original.fullName
      return (
        <CopyTooltip text={fullName} copyText="Copy name">
          {fullName}
        </CopyTooltip>
      )
    }
  }
]
