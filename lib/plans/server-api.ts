import type { ProductFetchResponse } from "@/lib/plans/types"
import { getEnvVar } from "@/lib/utils"

const apiServerBaseUrl = getEnvVar("API_SERVER_BASEURL")
// API Plans
const scaleProductId = getEnvVar("STRIPE_SCALE_PRODUCT_ID")
const enterpriseProductId = getEnvVar("STRIPE_ENTERPRISE_PRODUCT_ID")
// Token Packs
const starterPackProductId = getEnvVar("STRIPE_STARTER_PACK_PRODUCT_ID")
const proPackProductId = getEnvVar("STRIPE_PRO_PACK_PRODUCT_ID")
const businessPackProductId = getEnvVar("STRIPE_BUSINESS_PACK_PRODUCT_ID")
const enterprisePackProductId = getEnvVar("STRIPE_ENTERPRISE_PACK_PRODUCT_ID")

// Cache configuration for the APIs
const cache = {
  next: {
    revalidate: 60 * 60 // 1 hour
  }
}

/**
 * Fetches all products.
 * This function is called from RSC, hence needs to be called with the server base url.
 * The results are cached for 1 hour
 * @returns {Promise<ProductFetchResponse>}
 */
export const fetchAllProducts = async (): Promise<ProductFetchResponse> => {
  const scaleProductParams = new URLSearchParams({ product_id: scaleProductId })
  const enterpriseProductParams = new URLSearchParams({ product_id: enterpriseProductId })
  const starterPackProductParams = new URLSearchParams({ product_id: starterPackProductId })
  const proPackProductParams = new URLSearchParams({ product_id: proPackProductId })
  const businessPackProductParams = new URLSearchParams({ product_id: businessPackProductId })
  const enterprisePackProductParams = new URLSearchParams({ product_id: enterprisePackProductId })

  const responses = await Promise.all([
    // API Plans
    fetch(`${apiServerBaseUrl}/payment/product_with_prices?${scaleProductParams.toString()}`, {
      next: cache.next
    }),
    fetch(`${apiServerBaseUrl}/payment/product_with_prices?${enterpriseProductParams.toString()}`, {
      next: cache.next
    }),
    // Token Packs
    fetch(
      `${apiServerBaseUrl}/payment/product_with_prices?${starterPackProductParams.toString()}`,
      { next: cache.next }
    ),
    fetch(`${apiServerBaseUrl}/payment/product_with_prices?${proPackProductParams.toString()}`, {
      next: cache.next
    }),
    fetch(
      `${apiServerBaseUrl}/payment/product_with_prices?${businessPackProductParams.toString()}`,
      { next: cache.next }
    ),
    fetch(
      `${apiServerBaseUrl}/payment/product_with_prices?${enterprisePackProductParams.toString()}`,
      { next: cache.next }
    )
  ])
  if (!responses.every((response) => response.ok)) {
    throw new Error("Failed to fetch products", {
      cause: responses.map(
        (response, index) => `Fetch ${index}: ${response.status} ${response.statusText}`
      )
    })
  }
  const [ScaleAPI, EnterpriseAPI, StarterPack, ProPack, BusinessPack, EnterprisePack] =
    await Promise.all(responses.map((response) => response.json()))

  return {
    plans: {
      ScaleAPI,
      EnterpriseAPI
    },
    tokenPacks: {
      StarterPack,
      ProPack,
      BusinessPack,
      EnterprisePack
    }
  }
}
