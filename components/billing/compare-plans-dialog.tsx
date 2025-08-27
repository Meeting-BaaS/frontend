import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { ComparePlans } from "@/components/pricing/compare-plans"
import type { PlanInfo } from "@/lib/plans/types"
import { Button } from "@/components/ui/button"

interface ComparePlansDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  plans: PlanInfo[]
}

export function ComparePlansDialog({ open, onOpenChange, plans }: ComparePlansDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="h-[80svh] max-w-6xl sm:max-w-7xl">
        <DialogHeader>
          <DialogTitle>Compare Plans</DialogTitle>
          <DialogDescription>
            Compare the features of each plan to find the best fit for your needs.
          </DialogDescription>
        </DialogHeader>
        <div className="h-full overflow-y-auto md:pr-4">
          <ComparePlans plans={plans} isBillingPage />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
