import { IssueStatusCard } from "@/components/analytics/issue-reports/issue-status-card"
import { IssueTimelineCard } from "@/components/analytics/issue-reports/issue-timeline-card"
import type { IssueReportData, IssueReportTimelineEntry } from "@/lib/types"

interface IssueReportsProps {
  statusCounts: IssueReportData["statusCounts"]
  timelineData: IssueReportTimelineEntry[]
}

const statusColors = {
  open: "var(--destructive)",
  in_progress: "var(--baas-warning-500)",
  closed: "var(--primary)"
}

export default function IssueReports({ statusCounts, timelineData }: IssueReportsProps) {
  return (
    <>
      <div className="grid gap-4 md:grid-cols-3">
        <IssueStatusCard
          title="Open Issues"
          description="Currently open issues"
          count={statusCounts.open}
          color={statusColors.open}
          status="open"
        />
        <IssueStatusCard
          title="In Progress"
          description="Issues being worked on"
          count={statusCounts.in_progress}
          color={statusColors.in_progress}
          status="in_progress"
        />
        <IssueStatusCard
          title="Closed Issues"
          description="Resolved issues"
          count={statusCounts.closed}
          color={statusColors.closed}
          status="closed"
        />
      </div>
      <IssueTimelineCard timelineData={timelineData} statusColors={statusColors} />
    </>
  )
}
