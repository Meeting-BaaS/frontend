import type { CheckoutMode, SubscriptionResponse } from "@/lib/subscription/types"
import type { PlanType } from "@/lib/plans/types"

/**
 * Fetches User's subscription info on the client side
 * This function is called to refetch the subscription info on the client side.
 * If any changes are made to this function, make sure to update the fetchServerSubscriptionsInfo function in the server side api.ts file.
 * @returns {Promise<SubscriptionResponse>}
 */
export async function fetchSubscriptionsInfo(): Promise<SubscriptionResponse> {
  const response = await fetch("/api/baas/payment/subscriptions_infos")
  if (!response.ok) {
    throw new Error(`Failed to fetch subscription info: ${response.status} ${response.statusText}`)
  }
  return response.json()
}

interface InitiatePurchaseParams {
  productId: string
  mode: CheckoutMode
  discount_percentage?: number
}

export async function initiatePurchase({
  productId,
  mode = "payment",
  discount_percentage
}: InitiatePurchaseParams) {
  const response = await fetch("/api/baas/payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      plan_id: productId,
      mode,
      discount_percentage: discount_percentage || 0
    })
  })

  if (!response.ok) {
    throw new Error(`Failed to initiate purchase: ${response.status} ${response.statusText}`)
  }

  return response.json()
}

export async function openBillingPortal() {
  const response = await fetch("/api/baas/payment/create_billing_portal", {
    method: "POST"
  })

  if (!response.ok) {
    throw new Error(`Failed to open billing portal: ${response.status} ${response.statusText}`)
  }

  return response.json()
}
