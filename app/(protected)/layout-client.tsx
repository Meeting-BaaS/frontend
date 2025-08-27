"use client"

import type { Session } from "@/lib/auth/types"
import ProtectedHeader from "@/components/protected-header"
import Footer from "@/components/footer"
import { useSession } from "@/hooks/use-session"
import { useRouter } from "next/navigation"

interface ProtectedLayoutClientProps {
  session: Session
  children: React.ReactNode
}

export default function ProtectedLayoutClient({
  children,
  session: initialSession
}: ProtectedLayoutClientProps) {
  const session = useSession(initialSession)
  const router = useRouter()

  if (!session) {
    router.push("/pricing")
    return null
  }

  return (
    <>
      <ProtectedHeader user={session.user} />
      <main className="flex grow flex-col">{children}</main>
      <Footer page="Billing" />
    </>
  )
}
