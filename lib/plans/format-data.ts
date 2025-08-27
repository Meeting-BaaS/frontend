import type {
  PlanInfo,
  PlanType,
  ProductFetchResponse,
  PlanMetadata,
  TokenPackInfo,
  TokenPackMetadata
} from "@/lib/plans/types"
import { defaultPlanInfo, packFeatures } from "@/lib/plans/constants"
import { getAuthAppUrl } from "@/lib/auth/auth-app-url"
import { BILLING_URL } from "@/lib/external-urls"
import { getEnvVar } from "@/lib/utils"

interface FormattedData {
  apiPlans: PlanInfo[]
  tokenPacks: TokenPackInfo[]
}

const getRedirectTo = (planType: PlanType, planOrTokenPack: "plan" | "token_pack") => {
  const signInUrl = getAuthAppUrl()
  const searchParams = new URLSearchParams()
  searchParams.set(planOrTokenPack, planType.toLowerCase())
  const redirectTo = encodeURIComponent(`${BILLING_URL}?${searchParams.toString()}`)

  return `${signInUrl}/sign-in?redirectTo=${redirectTo}`
}

export const getAllPriceIds = () => {
  // API plan price ids
  const scaleApiPriceId = getEnvVar("STRIPE_SCALE_PRICE_ID")
  const enterpriseApiPriceId = getEnvVar("STRIPE_ENTERPRISE_PRICE_ID")
  // Token pack price ids
  const starterPackPriceId = getEnvVar("STRIPE_STARTER_PACK_PRICE_ID")
  const proPackPriceId = getEnvVar("STRIPE_PRO_PACK_PRICE_ID")
  const businessPackPriceId = getEnvVar("STRIPE_BUSINESS_PACK_PRICE_ID")
  const enterprisePackPriceId = getEnvVar("STRIPE_ENTERPRISE_PACK_PRICE_ID")

  const plansPriceIds: Record<PlanType, string> = {
    PayAsYouGo: "",
    ScaleAPI: scaleApiPriceId,
    EnterpriseAPI: enterpriseApiPriceId,
    StarterPack: starterPackPriceId,
    ProPack: proPackPriceId,
    BusinessPack: businessPackPriceId,
    EnterprisePack: enterprisePackPriceId
  }
  return plansPriceIds
}

export const formatData = (products: ProductFetchResponse): FormattedData => {
  const apiPlans: PlanInfo[] = [defaultPlanInfo]
  const tokenPacks: TokenPackInfo[] = []
  const plansPriceIds = getAllPriceIds()

  // Handle API plans
  for (const [key, value] of Object.entries(products.plans)) {
    const metadata = value.product.metadata as PlanMetadata
    apiPlans.push({
      productId: value.product.id,
      concurrentBots: Number.parseInt(metadata.concurrentBots ?? "0"),
      requestsPerSecond: Number.parseInt(metadata.requestsPerSecond ?? "0"),
      tokenDiscount: Number.parseInt(metadata.tokenDiscount ?? "0"),
      price: (value.prices[0].unit_amount / 100).toString(),
      billingScheme: value.prices[0].billing_scheme,
      currency: value.prices[0].currency,
      interval: value.prices[0].recurring.interval,
      active: value.product.active,
      livemode: value.product.livemode,
      title: value.product.name.replace("Baas ", ""), // Remove the "Baas " prefix from the title
      type: key as PlanType,
      features: packFeatures[key as PlanType],
      redirectTo: getRedirectTo(key as PlanType, "plan"),
      priceId: plansPriceIds[key as PlanType]
    })
  }

  for (const [key, value] of Object.entries(products.tokenPacks)) {
    const metadata = value.product.metadata as TokenPackMetadata
    tokenPacks.push({
      title: value.product.name.replace("Baas ", ""), // Remove the "Baas " prefix from the title
      price: value.prices[0].unit_amount / 100,
      stripePriceId: value.prices[0].id,
      features: packFeatures[key as PlanType],
      tokens: Number.parseInt(metadata.tokens),
      isHighlighted: false,
      type: key as PlanType,
      redirectTo: getRedirectTo(key as PlanType, "token_pack"),
      priceId: plansPriceIds[key as PlanType]
    })
  }

  return { apiPlans, tokenPacks }
}
