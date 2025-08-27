"use client"

import { ErrorTimelineCard } from "@/components/analytics/error-analysis/error-timeline-card"
import type { ErrorDistribution } from "@/lib/types"
import { ErrorDistributionPopover } from "@/components/analytics/error-distribution-popover"

interface ErrorAnalysisProps {
  errorDistributionData: ErrorDistribution[]
}

export default function ErrorAnalysis({ errorDistributionData }: ErrorAnalysisProps) {
  return (
    <>
      <div className="flex md:justify-end">
        <ErrorDistributionPopover errorDistributionData={errorDistributionData} />
      </div>
      <ErrorTimelineCard />
    </>
  )
}
