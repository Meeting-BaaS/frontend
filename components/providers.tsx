"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { JwtProvider } from "@/contexts/jwt-context"
import { TooltipProvider } from "@/components/ui/tooltip"

const queryClient = new QueryClient()

export default function Providers({
  children,
  jwt
}: Readonly<{
  children: React.ReactNode
  jwt: string
}>) {
  return (
    <JwtProvider jwt={jwt}>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>{children}</TooltipProvider>
      </QueryClientProvider>
    </JwtProvider>
  )
}
