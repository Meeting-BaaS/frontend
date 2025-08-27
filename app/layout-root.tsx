"use client"

import type { Session } from "@/lib/auth/types"
import Header from "@/components/header"
import { SidebarInset } from "@/components/ui/sidebar"
import Footer from "@/components/footer"
import AppSidebar from "@/components/sidebar"
import { useSession } from "@/hooks/use-session"
import { isMeetingBaasUser } from "@/lib/utils"

interface LayoutRootProps {
  session: Session
  children: React.ReactNode
}

export default function LayoutRoot({ children, session: initialSession }: LayoutRootProps) {
  const session = useSession(initialSession)

  if (!session) {
    return null
  }

  const meetingBaasUser = isMeetingBaasUser(initialSession?.user?.email)

  return (
    <div className="[--header-height:calc(theme(spacing.12))]">
      <Header user={session.user} />
      <div className="flex min-h-svh flex-1">
        <AppSidebar meetingBaasUser={meetingBaasUser} />
        <SidebarInset className="mt-[var(--header-height)]">
          <div className="flex grow flex-col p-4 md:p-10">{children}</div>
          <Footer />
        </SidebarInset>
      </div>
    </div>
  )
}
