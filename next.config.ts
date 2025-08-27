import type { NextConfig } from "next"

if (!process.env.API_SERVER_BASEURL) {
  throw new Error(
    "API_SERVER_BASEURL environment variable is required. Please set it in your .env file."
  )
}

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.API_SERVER_BASEURL}/:path*`
      }
    ]
  }
}

export default nextConfig
