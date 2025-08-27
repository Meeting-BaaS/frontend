import type { TokenPackInfo, PlanInfo } from "@/lib/plans/types"
import type { CheckoutMode } from "@/lib/subscription/types"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { useSubscription } from "@/hooks/use-subscription"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { useSearchParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { isEqual } from "lodash-es"

interface PurchaseDialogProps {
  purchaseDialog: PurchaseDialogState
  onOpenChange: (purchaseDialog: PurchaseDialogState) => void
}

export type PurchaseDialogState =
  | {
      open: boolean
      apiPlanOrTokenPack: "plan"
      purchaseInfo: PlanInfo
      checkoutMode: CheckoutMode
    }
  | {
      open: boolean
      apiPlanOrTokenPack: "token_pack"
      purchaseInfo: TokenPackInfo
      checkoutMode: CheckoutMode
    }
  | null

export function PurchaseDialog({ purchaseDialog, onOpenChange }: PurchaseDialogProps) {
  const { initiatePurchase, initiatePurchaseLoading } = useSubscription()
  const searchParams = useSearchParams()
  const router = useRouter()

  const clearSearchParams = () => {
    const plan = searchParams.get("plan")
    const tokenPack = searchParams.get("token_pack")
    const newParams = new URLSearchParams(searchParams)
    if (plan) newParams.delete("plan")
    if (tokenPack) newParams.delete("token_pack")
    if (!isEqual(newParams.toString(), searchParams.toString())) {
      router.replace(`?${newParams.toString()}`, { scroll: false })
    }
  }

  const handleOpenChange = (open: boolean) => {
    // If the purchase is loading, we don't want to close the dialog
    if (initiatePurchaseLoading) return

    if (open) {
      onOpenChange(purchaseDialog)
    } else {
      onOpenChange(null)
      // Clear search params to prevent them from being passed when page is refreshed
      clearSearchParams()
    }
  }

  const handlePurchase = () => {
    if (!purchaseDialog || initiatePurchaseLoading) return
    initiatePurchase(
      {
        productId: purchaseDialog.purchaseInfo.priceId,
        mode: purchaseDialog.checkoutMode
      },
      {
        onSuccess: () => {
          handleOpenChange(false)
        }
      }
    )
  }

  return (
    <Dialog open={purchaseDialog?.open ?? false} onOpenChange={handleOpenChange}>
      <DialogContent hideCloseButton={initiatePurchaseLoading}>
        {purchaseDialog && (
          <>
            <DialogHeader>
              <DialogTitle>
                {purchaseDialog.apiPlanOrTokenPack === "plan" ? "Subscribe to " : "Purchase "}
                {purchaseDialog.purchaseInfo.title}
              </DialogTitle>
              <DialogDescription>
                You will be redirected to a secure payment gateway to complete your purchase.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild disabled={initiatePurchaseLoading}>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                onClick={handlePurchase}
                disabled={initiatePurchaseLoading}
                aria-disabled={initiatePurchaseLoading}
              >
                {initiatePurchaseLoading ? (
                  <>
                    <Loader2 className="animate-spin" />
                    Initiating...
                  </>
                ) : (
                  "Continue"
                )}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
