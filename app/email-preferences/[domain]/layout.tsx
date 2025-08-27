import { PageTitle } from "@/components/page-title"

export default async function DomainLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <PageTitle
        title="Email Preferences"
        description="Manage which emails you receive from Meeting BaaS."
      />
      {children}
    </>
  )
}
