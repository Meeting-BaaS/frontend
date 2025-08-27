import type { FormattedBotData, PlatformDistribution, ErrorDistribution } from "@/lib/types"
import { ErrorDistributionCard } from "@/components/analytics/overview/error-distribution-card"
import { ErrorTableCard } from "@/components/analytics/overview/error-table-card"
import type { ErrorTableEntry } from "@/lib/types"
import { PlatformDistributionCard } from "@/components/analytics/overview/platform-distribution-card"
import { PlatformPerformanceCard } from "@/components/analytics/overview/platform-performance-card"

interface OverviewProps {
  platformDistribution: PlatformDistribution[]
  allBots: FormattedBotData[]
  errorDistributionData: ErrorDistribution[]
  errorBots: FormattedBotData[]
  errorTableData: ErrorTableEntry[]
}

export default function Overview({
  platformDistribution,
  allBots,
  errorDistributionData,
  errorBots,
  errorTableData
}: OverviewProps) {
  return (
    <>
      <div className="flex flex-col gap-4 md:flex-row">
        <PlatformDistributionCard
          platformDistribution={platformDistribution}
          totalBots={allBots.length}
        />
        <PlatformPerformanceCard />
      </div>
      <ErrorDistributionCard
        errorDistributionData={errorDistributionData}
        totalErrors={errorBots.length}
      />
      <ErrorTableCard data={errorTableData} />
    </>
  )
}
