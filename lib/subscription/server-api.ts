import type { SubscriptionResponse } from "@/lib/subscription/types"
import { getEnvVar } from "@/lib/utils"

const apiServerBaseUrl = getEnvVar("API_SERVER_BASEURL")
/**
 * Fetches User's subscription info on the server side
 * This function is called from RSC, hence needs to be called with the server base url and cookies.
 * If any changes are made to this function, make sure to update the fetchSubscriptionsInfo function in the client side api.ts file.
 * @param jwt - The JWT token for the user
 * @returns {Promise<SubscriptionResponse>}
 */
export async function fetchServerSubscriptionsInfo(jwt: string): Promise<SubscriptionResponse> {
  const response = await fetch(`${apiServerBaseUrl}/payment/subscriptions_infos`, {
    headers: {
      Cookie: `jwt=${jwt}`
    }
  })
  if (!response.ok) {
    throw new Error(`Failed to fetch subscription info: ${response.status} ${response.statusText}`)
  }
  const data = await response.json()
  return data
}
