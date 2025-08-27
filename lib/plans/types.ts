export type PlanType =
  | "PayAsYouGo"
  | "StarterPack"
  | "ProPack"
  | "BusinessPack"
  | "EnterprisePack"
  | "ScaleAPI"
  | "EnterpriseAPI"

export type Feature =
  | "Basic support"
  | "Priority support"
  | "Email support"
  | "Phone & Email support"
  | "Dedicated support"
  | "Calendar integration"

export type PlanMetadata = {
  requestsPerSecond: string
  tokenDiscount: string
  concurrentBots: string
}

export type TokenPackMetadata = {
  tokens: string
}

export type ProductMetadata = TokenPackMetadata | PlanMetadata

export type Price = {
  active: boolean
  unit_amount: number
  billing_scheme: string
  currency: string
  recurring: {
    interval: string
  }
  id: string
}

export type ProductResponse = {
  product: {
    id: string
    livemode: boolean
    active: boolean
    metadata: ProductMetadata
    name: string
  }
  prices: Price[]
}

export type ProductFetchResponse = {
  plans: {
    ScaleAPI: ProductResponse
    EnterpriseAPI: ProductResponse
  }
  tokenPacks: {
    StarterPack: ProductResponse
    ProPack: ProductResponse
    BusinessPack: ProductResponse
    EnterprisePack: ProductResponse
  }
}

export type PlanInfo = {
  productId: string
  concurrentBots: number
  requestsPerSecond: number
  tokenDiscount: number
  price: string
  billingScheme: string
  currency: string
  interval: string
  active: boolean
  livemode: boolean
  title: string
  type: PlanType
  features: Feature[]
  redirectTo: string
  priceId: string
}

export type TokenPackInfo = {
  title: string
  price: number
  stripePriceId: string
  features: Feature[]
  tokens: number
  type: PlanType
  isHighlighted?: boolean
  redirectTo: string
  priceId: string
}

export type PlanFeature = {
  name: string
  description?: string
  supportedIn: PlanType[]
}
