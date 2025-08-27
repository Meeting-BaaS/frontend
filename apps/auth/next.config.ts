import type { NextConfig } from "next";

if (!process.env.API_SERVER_BASEURL) {
  throw new Error(
      "API_SERVER_BASEURL is not defined in the environment variables. Please set it in your .env file."
  )
}

const nextConfig: NextConfig = {
  transpilePackages: ["@repo/shared"],
  async rewrites() {
    // This is a proxy for requests to the API server
    // When making requests to the API server, we need to prefix the path with /api/baas
    return [
        {
            source: "/api/baas/:path*",
            destination: `${process.env.API_SERVER_BASEURL}/:path*`
        }
    ]
}
};

export default nextConfig;
