import type { PlanType } from "@/lib/plans/types"

export type SubscriptionStatus =
  | "active"
  | "canceled"
  | "incomplete"
  | "incomplete_expired"
  | "past_due"
  | "paused"
  | "trialing"
  | "unpaid"
  | null

export type SubscriptionResponse = {
  subscription: {
    email: string
    product: PlanType
    stripePlanId: string | null
    stripeProductId: string | null
    stripeSubscriptionStatus: SubscriptionStatus | null
    trialEnd: string | null
  }
}

export type CheckoutMode = "payment" | "subscription"
