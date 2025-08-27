import { PageTitle } from "@/components/page-title"
import { isMeetingBaasUser } from "@/lib/utils"
import { getAuthSession } from "@/lib/auth/session"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { broadcastRoutes } from "@/components/broadcasts/broadcast-routes"

export default async function BroadcastsPage() {
  const requestCookies = await cookies()
  // RSCs need to pass cookies to getAuthSession
  const session = await getAuthSession(requestCookies.toString())

  const isMeetingBaas = isMeetingBaasUser(session?.user?.email)

  if (!isMeetingBaas) {
    redirect("/")
  }

  return (
    <>
      <PageTitle title="Broadcasts" description="Create and manage your broadcasts." />
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        {broadcastRoutes.map((option) => (
          <Link href={`/broadcasts/${option.type}`} key={option.name}>
            <Card className="mb-6 transition-colors hover:border-baas-primary-700 dark:bg-[linear-gradient(238deg,#161616,hsla(0,0%,9%,0))] dark:bg-baas-black">
              <CardContent>
                <h3 className="mb-1 flex items-center justify-center gap-2 font-medium text-lg sm:justify-start">
                  {option.name}
                </h3>
                <div className="flex flex-col items-center gap-2 sm:flex-row">
                  <p className="text-muted-foreground text-sm">{option.description}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </>
  )
}
