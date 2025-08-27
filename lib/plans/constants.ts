import type { Feature, PlanFeature, PlanInfo, PlanType } from "@/lib/plans/types"
import { getAuthAppUrl } from "@/lib/auth/auth-app-url"

export const packFeatures: Record<PlanType, Feature[]> = {
  // API plans
  PayAsYouGo: ["Basic support"],
  ScaleAPI: ["Priority support"],
  EnterpriseAPI: ["Dedicated support", "Calendar integration"],
  // Token packs
  StarterPack: ["Basic support", "Email support"],
  ProPack: ["Priority support", "Email support"],
  BusinessPack: ["Priority support", "Phone & Email support"],
  EnterprisePack: ["Dedicated support", "Phone & Email support"]
}

export const planComparisonFeatures: PlanFeature[] = [
  {
    name: "Multi-Platform Meeting Integration",
    description: "Unified API for Google Meet, Zoom, and Microsoft Teams",
    supportedIn: ["PayAsYouGo", "ScaleAPI", "EnterpriseAPI"]
  },
  {
    name: "Transcription",
    description: "Out-of-the-box meeting transcription powered by Gladia",
    supportedIn: ["PayAsYouGo", "ScaleAPI", "EnterpriseAPI"]
  },
  {
    name: "Speaker Diarization",
    description: "Automatically identify and separate different speakers in the meeting",
    supportedIn: ["PayAsYouGo", "ScaleAPI", "EnterpriseAPI"]
  },
  {
    name: "Meeting Metadata",
    supportedIn: ["PayAsYouGo", "ScaleAPI", "EnterpriseAPI"]
  },
  {
    name: "Custom Parameters",
    description: "Add custom JSON data to enhance your meeting data",
    supportedIn: ["PayAsYouGo", "ScaleAPI", "EnterpriseAPI"]
  },
  {
    name: "Raw Video & Audio",
    description: "Direct access to meeting recordings for advanced processing",
    supportedIn: ["PayAsYouGo", "ScaleAPI", "EnterpriseAPI"]
  },
  {
    name: "Custom Transcription API",
    description: "Integrate your own transcription engine",
    supportedIn: ["PayAsYouGo", "ScaleAPI", "EnterpriseAPI"]
  },
  {
    name: "Streaming",
    description: "Real-time access to meeting data",
    supportedIn: ["PayAsYouGo", "ScaleAPI", "EnterpriseAPI"]
  },
  {
    name: "Calendar Integration",
    description: "Seamless integration with calendar systems",
    supportedIn: ["EnterpriseAPI"]
  },
  {
    name: "Basic Support",
    supportedIn: ["PayAsYouGo", "ScaleAPI", "EnterpriseAPI"]
  },
  {
    name: "Priority Support",
    supportedIn: ["ScaleAPI", "EnterpriseAPI"]
  },
  {
    name: "Dedicated Support",
    supportedIn: ["EnterpriseAPI"]
  }
]

export const allSubscriptionPlanTypes: PlanType[] = ["ScaleAPI", "EnterpriseAPI"]

export const allTokenPackTypes: PlanType[] = [
  "StarterPack",
  "ProPack",
  "BusinessPack",
  "EnterprisePack"
]

// Default plan info for the Pay as you go plan
export const defaultPlanInfo: PlanInfo = {
  productId: "pay_as_you_go_plan",
  concurrentBots: 5,
  requestsPerSecond: 2,
  tokenDiscount: 0,
  price: "0",
  billingScheme: "per_unit",
  currency: "usd",
  interval: "month",
  active: true,
  livemode: false,
  title: "Pay as you go",
  type: "PayAsYouGo",
  features: packFeatures.PayAsYouGo,
  redirectTo: getAuthAppUrl(), // Redirect to the auth app for the free plan as it does not require payment
  priceId: ""
}
