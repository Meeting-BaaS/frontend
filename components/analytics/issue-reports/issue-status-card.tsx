"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AnimatedNumber } from "@/components/ui/animated-number"
import { LOGS_URL } from "@/lib/external-urls"
import { ExternalLink } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { UserReportedErrorStatus } from "@/lib/types"

interface IssueStatusCardProps {
  title: string
  description: string
  count: number
  color: string
  status: UserReportedErrorStatus
}

export function IssueStatusCard({
  title,
  description,
  count,
  color,
  status
}: IssueStatusCardProps) {
  const logsUrl = `${LOGS_URL}?userReportedErrorStatusFilters=${status}`

  return (
    <Card className="relative dark:bg-baas-black">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="absolute top-2 right-2"
            aria-label={`View all ${title.replace("_", "").toLowerCase()} issues`}
          >
            <Link href={logsUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
          <span className="font-bold text-2xl">
            <AnimatedNumber value={count} />
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
