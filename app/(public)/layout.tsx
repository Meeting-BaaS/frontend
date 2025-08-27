import Footer from "@/components/footer"
import Header from "@/components/header"
import type { Metadata } from "next"
import { Toaster } from "sonner"

export const metadata: Metadata = {
  title: "Pricing | Meeting BaaS",
  description: "Pricing for Meeting BaaS"
}

export default async function PublicLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Header />
      <main className="flex grow flex-col">{children}</main>
      <Footer page="Pricing" />
      <Toaster />
    </>
  )
}
