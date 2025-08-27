import { getAuthAppUrl } from "@repo/shared/auth/auth-app-url"
import { LOGS_URL } from "@repo/shared/lib/external-urls"
import { isbot } from "isbot"
import { type NextRequest, NextResponse } from "next/server"

if (!process.env.AUTH_COOKIE_PREFIX) {
  throw new Error("AUTH_COOKIE_PREFIX environment variable is not defined")
}

const authAppUrl = getAuthAppUrl()

export async function middleware(request: NextRequest) {
  // Check if auth cookie exists before processing request
  // Fetch session in RSC/APIs to further protect a route
  const authCookieName = `${process.env.AUTH_COOKIE_PREFIX}.session_token`
  const cookie = authCookieName ? request.cookies.get(authCookieName) : undefined
  const response = NextResponse.next()
  const userAgent = request.headers.get("user-agent")

  // If the request is from a bot, let it pass through
  // This is to prevent bots from being redirected to the auth app
  if (isbot(userAgent)) {
    return NextResponse.next()
  }

  const signInUrl = `${authAppUrl}/sign-in`
  // If the app is self hosted, get the app url from the environment configuration
  // When hosted on Vercel, the origin is the same as the auth app url
  // In development, the origin is the same as the auth app url
  const appUrl =
    process.env.NODE_ENV === "development" || process.env.SELF_HOST !== "true"
      ? request.nextUrl.origin
      : LOGS_URL
  const redirectTo = `${appUrl}${request.nextUrl.pathname}${request.nextUrl.search}`

  if (!cookie) {
    const newUrl = new URL(`${signInUrl}${request.nextUrl.search}`)
    newUrl.searchParams.set("redirectTo", redirectTo)
    console.warn("No cookie found in middleware, redirecting to sign in", {
      cookieExists: !!cookie,
      redirectionUrl: newUrl.toString()
    })
    return NextResponse.redirect(newUrl)
  }

  // Setting a custom header so that RSCs can handle redirection if session not found
  response.headers.set("x-redirect-to", redirectTo)

  return response
}

// skipping static and api routes
// Api routes are protected by fetch session request
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"]
}
