import { getSessionCookie } from "better-auth/cookies"
import { type NextRequest, NextResponse } from "next/server"

const authRoutes = ["/sign-in", "/sign-up", "/verify-email", "/forgot-password", "/reset-password"]
const allowedOrigins =
  process.env.TRUSTED_ORIGINS?.split(",")
    .map((o) => o.trim())
    .filter(Boolean) ?? []

if (process.env.APP_URL) {
  allowedOrigins.push(process.env.APP_URL)
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const origin = request.headers.get("origin") || ""

  console.log("[Auth Middleware] Request origin:", origin)

  const isApiRoute = pathname.startsWith("/api/")
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Create base response
  const response =
    request.method === "OPTIONS" ? new Response(null, { status: 204 }) : NextResponse.next()

  // Apply CORS headers if API route and origin allowed
  if (isApiRoute) {
    if (allowedOrigins.includes(origin)) {
      response.headers.set("Access-Control-Allow-Origin", origin)
      response.headers.set("Access-Control-Allow-Credentials", "true")
      response.headers.set("Access-Control-Allow-Methods", "GET,POST,OPTIONS")
      response.headers.set(
        "Access-Control-Allow-Headers",
        "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization, Authorization2, x-spoke-api-key, x-meeting-baas-api-key"
      )

      if (request.method === "OPTIONS") {
        return response // end CORS preflight early
      }
    } else if (origin) {
      // For security, explicitly reject unauthorized cross-origin requests
      return new Response("Unauthorized origin", { status: 403 })
    }
  }

  // Handle authentication logic only for non-API routes
  if (!isApiRoute) {
    const sessionCookie = getSessionCookie(request, {
      cookiePrefix: process.env.AUTH_COOKIE_PREFIX
    })

    console.log("[Auth Middleware] Session cookie:", sessionCookie)

    if (!sessionCookie) {
      if (isAuthRoute) return response
      console.warn("[Auth Middleware] No session cookie found, redirecting to sign-in")
      return NextResponse.redirect(new URL("/sign-in", request.url))
    }

    if (isAuthRoute) {
      return NextResponse.redirect(new URL("/home", request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)" // existing auth matcher
  ]
}
