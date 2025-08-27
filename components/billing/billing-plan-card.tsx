import type { PlanInfo } from "@/lib/plans/types"
import { cn } from "@/lib/utils"
import { Check, Loader2 } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { SubscriptionResponse } from "@/lib/subscription/types"
import { useSubscription } from "@/hooks/use-subscription"
import { spotlightVariant } from "@/components/animations/background"
import { motion } from "motion/react"

interface BillingPlanCardProps {
  plan: PlanInfo
  currentSubscription: SubscriptionResponse
  handlePurchase: (plan: PlanInfo) => void
}

export function BillingPlanCard({
  plan,
  currentSubscription,
  handlePurchase
}: BillingPlanCardProps) {
  const { openBillingPortal, openBillingPortalLoading } = useSubscription()

  const isCurrentPlan = currentSubscription.subscription.product === plan.type
  const isAnySubscriptionPlan = currentSubscription.subscription.product !== "PayAsYouGo"

  // PayAsYouGo is a special case because it's not a subscription plan
  const isCurrentPayAsYouGo =
    isCurrentPlan && currentSubscription.subscription.product === "PayAsYouGo"
  const isActiveSubscriptionPlan =
    isCurrentPlan && currentSubscription.subscription.stripeSubscriptionStatus === "active"

  const isPopular = plan.type === "ScaleAPI"

  return (
    <Card className={cn("relative", isCurrentPlan && "border-primary")}>
      {isCurrentPlan && (
        <Badge variant="primary" className="-top-4 -translate-x-1/2 absolute left-1/2">
          Current Plan
        </Badge>
      )}
      {isPopular && (
        <>
          <Badge variant="default" className="absolute top-2 right-2 m-4">
            Most Popular
          </Badge>
          {!isAnySubscriptionPlan && (
            <motion.div
              className="-translate-x-1/2 absolute bottom-6 left-1/2 h-6 w-1/2 rounded-full blur-2xl"
              style={{
                background:
                  "radial-gradient(circle, rgba(0, 219, 205, 0.9) 10%, rgba(0, 219, 205, 0.8) 80%, transparent 100%)"
              }}
              initial={{ opacity: 0 }}
              whileInView={spotlightVariant()}
              viewport={{ once: true }}
              aria-hidden="true"
            />
          )}
        </>
      )}
      <CardHeader>
        <CardTitle>{plan.title}</CardTitle>
        <CardDescription className="mt-4 flex items-baseline">
          <span className="font-bold text-4xl text-foreground">${plan.price}</span>
          <span className="ml-0.5 text-muted-foreground">/{plan.interval}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="grow">
        <ul className="my-6 space-y-4 text-sm">
          <li className="flex items-center gap-2">
            <Check className="size-4 text-primary" />
            {plan.concurrentBots} Concurrent Bots
          </li>
          <li className="flex items-center gap-2">
            <Check className="size-4 text-primary" />
            {plan.requestsPerSecond} Requests/Second
          </li>
          {plan.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2">
              <Check className="size-4 text-primary" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        {isCurrentPayAsYouGo ? (
          <Button variant="outline" disabled className="w-full">
            Active
          </Button>
        ) : isActiveSubscriptionPlan ? (
          <Button
            variant="outline"
            className="z-20 w-full"
            onClick={() => openBillingPortal()}
            disabled={openBillingPortalLoading}
            aria-label={openBillingPortalLoading ? "Loading..." : "Manage Subscription"}
            aria-disabled={openBillingPortalLoading}
          >
            {openBillingPortalLoading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              "Manage Subscription"
            )}
          </Button>
        ) : plan.type !== "PayAsYouGo" ? (
          <Button variant="default" className="z-20 w-full" onClick={() => handlePurchase(plan)}>
            Subscribe
          </Button>
        ) : null}
      </CardFooter>
    </Card>
  )
}
