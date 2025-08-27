/**
 * Get the API key for the current user.
 * In order to keep the API path secure, this is called from RSCs.
 * It requires the complete URL + needs the jwt to be passed
 * @param jwt - The JWT token for the current user
 * @returns The API key for the current user
 */
export async function getApiKey(jwt: string): Promise<string> {
  const response = await fetch(`${process.env.API_SERVER_BASEURL}/accounts/api_key`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Cookie: `jwt=${jwt}`
    }
  })

  if (!response.ok) {
    throw new Error(`Failed to get api key: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data.api_key
}
