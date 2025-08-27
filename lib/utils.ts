import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { PlanType } from "@/lib/plans/types"
import { allSubscriptionPlanTypes, allTokenPackTypes } from "@/lib/plans/constants"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getEnvVar(key: string) {
  const value = process.env[key]
  if (!value) {
    throw new Error(
      `${key} is not defined in the environment variables. Please set it in your .env file.`
    )
  }
  return value
}

export function validatePlanSearchParam(
  selectedPlan?: string,
  currentPlan?: PlanType
): PlanType | null {
  if (!selectedPlan) return null

  const normalizedPlan = selectedPlan.toLowerCase()
  const matchingPlan = allSubscriptionPlanTypes.find(
    (plan) => plan.toLowerCase() === normalizedPlan
  )

  // If the selected plan is the same as the current plan, we don't want to show the purchase dialog
  if (matchingPlan === currentPlan) {
    return null
  }

  return matchingPlan || null
}

export function validateTokenPackSearchParam(selectedTokenPack?: string): PlanType | null {
  if (!selectedTokenPack) return null

  const normalizedTokenPack = selectedTokenPack.toLowerCase()
  const matchingTokenPack = allTokenPackTypes.find(
    (tokenPack) => tokenPack.toLowerCase() === normalizedTokenPack
  )

  return matchingTokenPack || null
}

// Format numbers consistently using Math.round to avoid floating point issues
export function formatPrice(price: number) {
  return (Math.round(price * 100) / 100).toFixed(2)
}
