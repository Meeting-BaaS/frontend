"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "next-themes"
import { SidebarProvider } from "@/components/ui/sidebar"
import { JwtProvider } from "@/contexts/jwt-context"

const queryClient = new QueryClient()

export default function Providers({
  children,
  jwt
}: Readonly<{
  children: React.ReactNode
  jwt: string
}>) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
      <JwtProvider jwt={jwt}>
        <QueryClientProvider client={queryClient}>
          <SidebarProvider className="flex flex-col">{children}</SidebarProvider>
        </QueryClientProvider>
      </JwtProvider>
    </ThemeProvider>
  )
}
