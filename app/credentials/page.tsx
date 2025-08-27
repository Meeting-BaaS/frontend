import Credentials from "@/components/credentials"
import { PageTitle } from "@/components/page-title"
import { getApiKey } from "@/lib/api/api-key-api"
import { cookies } from "next/headers"
import { cache } from "react"

const getCachedApiKey = cache(getApiKey)

export default async function CredentialsPage() {
  const jwt = (await cookies()).get("jwt")?.value || ""
  const apiKey = await getCachedApiKey(jwt)

  return (
    <>
      <PageTitle
        title="Credentials"
        description="Configure your credentials for all things BaaS."
      />
      <Credentials apiKey={apiKey} />
    </>
  )
}
