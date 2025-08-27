"use client"

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ErrorDistributionLegend } from "@/components/analytics/error-distribution-legend"
import type { ErrorDistribution } from "@/lib/types"

interface ErrorDistributionPopoverProps {
  errorDistributionData: ErrorDistribution[]
}

export function ErrorDistributionPopover({ errorDistributionData }: ErrorDistributionPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-full md:w-auto">
          Select Error Types
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0 md:w-96" align="end">
        <div className="p-4">
          <ErrorDistributionLegend
            errorDistributionData={errorDistributionData}
            variant="popover"
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
