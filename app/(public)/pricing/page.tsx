import type { Metadata } from "next"
import { fetchAllProducts } from "@/lib/plans/server-api"
import { cache } from "react"
import { formatData } from "@/lib/plans/format-data"
import Pricing from "@/components/pricing"

const fetchCachedProducts = cache(fetchAllProducts)

export const metadata: Metadata = {
  title: "Pricing | Meeting BaaS",
  description:
    "Flexible pricing tiers from starter to enterprise, with pay-as-you-go token packs. Scale your meeting bot operations efficiently.",
  keywords: [
    "Meeting BaaS",
    "Pricing",
    "Token Packs",
    "API Plans",
    "Meeting Automation",
    "Meeting Bot",
    "Meeting BaaS Pricing",
    "Meeting BaaS Token Packs",
    "Meeting BaaS API Plans"
  ],
  authors: [{ name: "Meeting BaaS Team" }],
  openGraph: {
    type: "website",
    title: "Pricing | Meeting BaaS",
    description:
      "Flexible pricing tiers from starter to enterprise, with pay-as-you-go token packs.",
    siteName: "Meeting BaaS",
    url: "https://pricing.meetingbaas.com/pricing",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Meeting BaaS Pricing",
        type: "image/png"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Pricing | Meeting BaaS",
    description:
      "Flexible pricing tiers from starter to enterprise, with pay-as-you-go token packs.",
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
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1
    }
  }
}

export default async function Page() {
  const products = await fetchCachedProducts()
  const { apiPlans, tokenPacks } = formatData(products)

  return <Pricing apiPlans={apiPlans} tokenPacks={tokenPacks} />
}
