import { PageTitle } from "@/components/page-title"
import { isMeetingBaasUser } from "@/lib/utils"
import { getAuthSession } from "@/lib/auth/session"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import LogsTable from "@/components/broadcasts/logs"

export default async function LogsPage() {
  const requestCookies = await cookies()
  // RSCs need to pass cookies to getAuthSession
  const session = await getAuthSession(requestCookies.toString())

  const isMeetingBaas = isMeetingBaasUser(session?.user?.email)

  if (!isMeetingBaas) {
    redirect("/")
  }

  return (
    <>
      <PageTitle title="Email Logs" description="View all email logs." />
      <LogsTable />
    </>
  )
}
