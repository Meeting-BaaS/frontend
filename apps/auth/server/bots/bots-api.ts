const apiServerBaseUrl = process.env.API_SERVER_BASEURL

if (!apiServerBaseUrl) {
  throw new Error(
    "API_SERVER_BASEURL is not defined in the environment variables. Please set it in your .env file."
  )
}

/**
 * Get the number of bots sent by the user.
 * We just need to know if the user has sent any bots, not the actual bots.
 * So, limit is set to 1.
 * @param jwt - The JWT token for the user
 * @returns The number of bots for the user
 */
export async function getAllBots(jwt: string): Promise<number> {
  const searchParams = new URLSearchParams()
  searchParams.set("offset", "0")
  searchParams.set("limit", "1")
  const botsResponse = await fetch(`${apiServerBaseUrl}/bots/all?${searchParams.toString()}`, {
    headers: {
      Cookie: `jwt=${jwt}`
    }
  })

  if (!botsResponse.ok) {
    throw new Error(`Failed to get bots: ${botsResponse.status} ${botsResponse.statusText}`)
  }

  const botData = await botsResponse.json()

  return botData.bots?.length ?? 0
}
