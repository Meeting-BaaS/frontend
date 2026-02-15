"use client"

import type { Session } from "@repo/shared/auth/types"
import Footer from "@repo/shared/components/layout/footer"
import Header from "@repo/shared/components/layout/header"
import { ZoomTokenAlert } from "@repo/shared/components/layout/zoom-token-alert"
import { SidebarInset } from "@repo/shared/components/ui/sidebar"
import { useSession } from "@repo/shared/hooks/use-session"
import { SETTINGS_URL } from "@repo/shared/lib/external-urls"
import AppSidebar from "@/components/sidebar"
import { isMeetingBaasUser } from "@/lib/app-utils"

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
      <Header
        user={session.user}
        currentPath={SETTINGS_URL}
        headerClassName="-translate-x-1/2 fixed top-0 left-1/2 z-50"
        hideZoomTokenAlert={true}
      />
      <div className="flex min-h-svh flex-1">
        <AppSidebar meetingBaasUser={meetingBaasUser} />
        <SidebarInset className="mt-[var(--header-height)]">
          <div className="flex grow flex-col p-4 md:p-10">
            <ZoomTokenAlert overrideClassName="w-auto lg:w-auto ml-0 top-0 mt-0 mb-2" />
            {children}
          </div>
          <Footer title="Settings" />
        </SidebarInset>
      </div>
    </div>
  )
}
