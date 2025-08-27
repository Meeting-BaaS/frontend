import "@/app/globals.css"
import { Toaster } from "@/components/ui/sonner"
import type { Viewport } from "next"
import { Sofia_Sans } from "next/font/google"
import { ThemeProvider } from "next-themes"

const sofiaSans = Sofia_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"]
})

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1
}

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sofiaSans.className} flex min-h-screen flex-col antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
