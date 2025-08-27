import Billing from "@/components/billing"
import { formatData } from "@/lib/plans/format-data"
import { fetchAllProducts } from "@/lib/plans/server-api"
import { fetchServerSubscriptionsInfo } from "@/lib/subscription/server-api"
import { cookies } from "next/headers"
import { cache } from "react"

const fetchCachedProducts = cache(fetchAllProducts)

export default async function BillingPage({
  searchParams
}: {
  searchParams: Promise<{ payment?: string; plan?: string; token_pack?: string }>
}) {
  const [products, requestCookies, requestSearchParams] = await Promise.all([
    fetchCachedProducts(),
    cookies(),
    searchParams
  ])
  const { payment, plan, token_pack } = requestSearchParams
  const jwt = requestCookies.get("jwt")?.value || ""
  const { apiPlans, tokenPacks } = formatData(products)

  const subscription = await fetchServerSubscriptionsInfo(jwt)

  return (
    <div className="m-4 md:mx-16 md:my-4">
      <Billing
        apiPlans={apiPlans}
        tokenPacks={tokenPacks}
        initialSubscription={subscription}
        paymentStatus={payment}
        selectedPlan={plan}
        selectedTokenPack={token_pack}
      />
    </div>
  )
}
