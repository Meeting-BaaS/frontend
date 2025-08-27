"use client"

import type { Session } from "@repo/shared/auth/types"
import Footer from "@repo/shared/components/layout/footer"
import Header from "@repo/shared/components/layout/header"
import { useSession } from "@repo/shared/hooks/use-session"
import { LOGS_URL } from "@repo/shared/lib/external-urls"

interface LayoutRootProps {
  session: Session
  children: React.ReactNode
}

export default function LayoutRoot({ children, session: initialSession }: LayoutRootProps) {
  const session = useSession(initialSession)

  if (!session) {
    return null
  }

  return (
    <>
      <Header user={session.user} currentPath={LOGS_URL} />
      <main className="flex grow flex-col">{children}</main>
      <Footer title="Logs" />
    </>
  )
}
