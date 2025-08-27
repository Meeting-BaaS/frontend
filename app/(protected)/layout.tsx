import { getAuthSession } from "@/lib/auth/session"
import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import ProtectedLayoutClient from "@/app/(protected)/layout-client"
import Providers from "@/components/providers"

export const metadata: Metadata = {
  title: "Billing | Meeting BaaS",
  description: "Access your billing information from Meeting BaaS"
}

export default async function ProtectedLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const requestCookies = await cookies()
  // RSCs need to pass cookies to getAuthSession
  const session = await getAuthSession(requestCookies.toString())
  const jwt = requestCookies.get("jwt")?.value || ""

  if (!session) {
    // Redirect to pricing page if user is not authenticated
    redirect("/pricing")
  }

  return (
    <Providers jwt={jwt}>
      <ProtectedLayoutClient session={session}>{children}</ProtectedLayoutClient>
    </Providers>
  )
}
