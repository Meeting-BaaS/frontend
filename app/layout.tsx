import "@/app/globals.css"
import { Toaster } from "@/components/ui/sonner"
import { getAuthSession } from "@/lib/auth/session"
import type { Metadata, Viewport } from "next"
import { Sofia_Sans } from "next/font/google"
import { cookies, headers } from "next/headers"
import { redirect } from "next/navigation"
import LayoutRoot from "@/app/layout-root"
import Providers from "@/components/providers"
import { getAuthAppUrl } from "@/lib/auth/auth-app-url"
import { isbot } from "isbot"
import NotFound from "@/app/not-found"

const sofiaSans = Sofia_Sans({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"]
})

export const metadata: Metadata = {
  title: "Settings | Meeting BaaS",
  description:
    "Access Meeting BaaS credentials, configure web hook path and update email preferences.",
  keywords: [
    "Meeting BaaS",
    "credentials",
    "web hook",
    "api key",
    "email preferences",
    "meeting bot",
    "analytics",
    "transcription",
    "Google Meet",
    "Teams",
    "Zoom"
  ],
  authors: [{ name: "Meeting BaaS Team" }],
  openGraph: {
    type: "website",
    title: "Settings | Meeting BaaS",
    description:
      "Access Meeting BaaS credentials, configure web hook path and update email preferences.",
    siteName: "Meeting BaaS",
    url: "https://settings.meetingbaas.com",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Meeting BaaS Settings",
        type: "image/png"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Settings | Meeting BaaS",
    description:
      "Access Meeting BaaS credentials, configure web hook path and update email preferences.",
    images: ["/og-image.png"],
    creator: "@MeetingBaas",
    site: "@MeetingBaas"
  },
  category: "Video Conferencing Tools",
  applicationName: "Meeting BaaS",
  creator: "Meeting BaaS",
  publisher: "Meeting BaaS",
  referrer: "origin-when-cross-origin",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false
    }
  }
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1
}

const authAppUrl = getAuthAppUrl()

export default async function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  const [requestHeaders, requestCookies] = await Promise.all([headers(), cookies()])
  // RSCs need to pass cookies to getAuthSession
  const session = await getAuthSession(requestCookies.toString())
  const jwt = requestCookies.get("jwt")?.value || ""
  const userAgent = requestHeaders.get("user-agent")

  if (!session) {
    // If the request is from a bot, show the not found page (Since this is a private app, we don't want bots to access it)
    // This is to prevent bots from being redirected to the auth app
    if (isbot(userAgent)) {
      return <NotFound />
    }
    const redirectTo = requestHeaders.get("x-redirect-to")
    const redirectionUrl = redirectTo
      ? `${authAppUrl}/sign-in?redirectTo=${redirectTo}`
      : `${authAppUrl}/sign-in`
    redirect(redirectionUrl)
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${sofiaSans.className} antialiased`}>
        <Providers jwt={jwt}>
          <LayoutRoot session={session}>{children}</LayoutRoot>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
