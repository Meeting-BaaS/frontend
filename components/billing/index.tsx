"use client"

import { useSubscription } from "@/hooks/use-subscription"
import { genericError } from "@/lib/errors"
import type { TokenPackInfo, PlanInfo } from "@/lib/plans/types"
import { Loader2 } from "lucide-react"
import type { SubscriptionResponse } from "@/lib/subscription/types"
import { useSession } from "@/hooks/use-session"
import { CurrentPlanCard } from "@/components/billing/current-plan-card"
import { Accordion, AccordionContent, AccordionItem } from "@/components/ui/accordion"
import { TokenCard } from "@/components/pricing/token-card"
import { TokenUsageRates } from "@/components/billing/token-usage-rates"
import { PurchaseDialog, type PurchaseDialogState } from "@/components/billing/purchase-dialog"
import { useState } from "react"
import { BillingPlanCard } from "@/components/billing/billing-plan-card"
import { validatePlanSearchParam, validateTokenPackSearchParam } from "@/lib/utils"
import { PaymentErrorDialog } from "@/components/billing/payment-error-dialog"
import { ComparePlansDialog } from "@/components/billing/compare-plans-dialog"
import { Button } from "@/components/ui/button"

interface BillingProps {
  apiPlans: PlanInfo[]
  tokenPacks: TokenPackInfo[]
  initialSubscription: SubscriptionResponse
  paymentStatus?: string
  selectedPlan?: string
  selectedTokenPack?: string
}

export default function Billing({
  apiPlans,
  tokenPacks,
  initialSubscription,
  paymentStatus,
  selectedPlan,
  selectedTokenPack
}: BillingProps) {
  const {
    subscription,
    isSubscriptionLoading,
    isSubscriptionRefetching,
    isSubscriptionError,
    subscriptionError
  } = useSubscription(initialSubscription)
  const [showPaymentError, setShowPaymentError] = useState(paymentStatus === "cancelled")
  const [showComparePlans, setShowComparePlans] = useState(false)

  const validatedSelectedPlan = validatePlanSearchParam(
    selectedPlan,
    subscription?.subscription.product
  )
  const validatedSelectedTokenPack = validateTokenPackSearchParam(selectedTokenPack)
  let purchaseDialogState: PurchaseDialogState = null

  // If the page is loaded with a plan or token pack, we want to show the subscription dialog
  // Both params together are not accepted
  if (validatedSelectedPlan) {
    purchaseDialogState = {
      open: true,
      apiPlanOrTokenPack: "plan",
      purchaseInfo: apiPlans.find((plan) => plan.type === validatedSelectedPlan) as PlanInfo,
      checkoutMode: "subscription"
    }
  } else if (validatedSelectedTokenPack) {
    purchaseDialogState = {
      open: true,
      apiPlanOrTokenPack: "token_pack",
      purchaseInfo: tokenPacks.find(
        (pack) => pack.type === validatedSelectedTokenPack
      ) as TokenPackInfo,
      checkoutMode: "payment"
    }
  }

  const [purchaseDialog, setPurchaseDialog] = useState<PurchaseDialogState>(purchaseDialogState)

  const handleTokenPackPurchase = (pack: TokenPackInfo) => {
    setPurchaseDialog({
      open: true,
      apiPlanOrTokenPack: "token_pack",
      purchaseInfo: pack,
      checkoutMode: "payment"
    })
  }

  const handlePlanSubscription = (plan: PlanInfo) => {
    setPurchaseDialog({
      open: true,
      apiPlanOrTokenPack: "plan",
      purchaseInfo: plan,
      checkoutMode: "subscription"
    })
  }

  return (
    <div className="relative space-y-4">
      {isSubscriptionLoading && !subscription ? (
        <div
          className="flex h-96 items-center justify-center"
          aria-label="Loading subscription data"
        >
          <Loader2 className="size-8 animate-spin text-primary" />
        </div>
      ) : isSubscriptionError ? (
        <div className="flex h-96 items-center justify-center text-destructive">
          Error: {subscriptionError instanceof Error ? subscriptionError.message : genericError}
        </div>
      ) : !subscription ? (
        <div className="flex h-96 items-center justify-center">No data found</div>
      ) : (
        <>
          <section className="pb-5">
            <TokenUsageRates />
          </section>
          <div className="mb-6">
            <h1 className="font-bold text-3xl">Billing Dashboard</h1>
            <p className="text-muted-foreground">{subscription.subscription.email}</p>
          </div>
          <Accordion
            type="single"
            collapsible
            defaultValue={
              subscription.subscription.product !== "EnterpriseAPI" ? "all-plans" : undefined
            }
          >
            <AccordionItem value="all-plans">
              <div className="w-full md:w-1/2 lg:w-1/3">
                <CurrentPlanCard
                  subscription={subscription}
                  allPlans={apiPlans}
                  isSubscriptionRefetching={isSubscriptionRefetching}
                />
              </div>
              <AccordionContent className="pt-10">
                <div className="mb-6">
                  <h2 className="font-bold text-2xl">API Plans</h2>
                  {subscription.subscription.product !== "EnterpriseAPI" && (
                    <p className="text-base text-muted-foreground">
                      Scale your concurrent bots and access features designed for growing
                      businesses.
                    </p>
                  )}
                </div>
                <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                  {apiPlans.map((plan) => (
                    <BillingPlanCard
                      key={plan.type}
                      plan={plan}
                      currentSubscription={subscription}
                      handlePurchase={handlePlanSubscription}
                    />
                  ))}
                </section>
                <div className="mt-2 flex w-full justify-end md:w-auto">
                  <Button variant="link" onClick={() => setShowComparePlans(true)}>
                    Compare Plans
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <section className="pt-5 pb-20">
            <div className="mb-6">
              <div className="font-bold text-2xl">Token Packs</div>
              <p className="text-base text-muted-foreground">
                Running low on tokens? Purchase a pack to get more.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {tokenPacks.map((pack) => (
                <TokenCard
                  key={pack.type}
                  pack={pack}
                  isHighlighted={pack.type === "EnterprisePack"}
                  apiPlans={apiPlans}
                  handlePurchase={handleTokenPackPurchase}
                  currentSubscription={subscription.subscription.product}
                />
              ))}
            </div>
          </section>
          <PurchaseDialog purchaseDialog={purchaseDialog} onOpenChange={setPurchaseDialog} />
          <PaymentErrorDialog open={showPaymentError} onOpenChange={setShowPaymentError} />
          <ComparePlansDialog
            open={showComparePlans}
            onOpenChange={setShowComparePlans}
            plans={apiPlans}
          />
        </>
      )}
    </div>
  )
}
