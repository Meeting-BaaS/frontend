import type { NextConfig } from "next"

if (!process.env.API_SERVER_BASEURL) {
  throw new Error(
    "API_SERVER_BASEURL is not defined in the environment variables. Please set it in your .env file."
  )
}

const nextConfig: NextConfig = {
  async rewrites() {
    const apiServerBaseUrl = process.env.API_SERVER_BASEURL
    return [
      {
        source: "/api/baas/:path*",
        destination: `${apiServerBaseUrl}/:path*`
      }
    ]
  }
}

export default nextConfig
