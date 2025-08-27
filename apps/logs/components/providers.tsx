"use client"

import { JwtProvider } from "@repo/shared/contexts/jwt-context"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ThemeProvider } from "next-themes"
import { TooltipProvider } from "@/components/ui/tooltip"
import { PostMessageProvider } from "@/contexts/post-message-context"
import { ScreenshotViewerProvider } from "@/contexts/screenshot-viewer-context"
import { TableDialogsProvider } from "@/contexts/table-dialogs-context"

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
        <PostMessageProvider>
          <QueryClientProvider client={queryClient}>
            <ScreenshotViewerProvider>
              <TableDialogsProvider>
                <TooltipProvider>{children}</TooltipProvider>
              </TableDialogsProvider>
            </ScreenshotViewerProvider>
          </QueryClientProvider>
        </PostMessageProvider>
      </JwtProvider>
    </ThemeProvider>
  )
}
