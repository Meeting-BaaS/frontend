import type { CookieOptions, MiddlewareContext, MiddlewareOptions } from "better-auth"
import jwt from "jsonwebtoken"

const getCookieAttributes = (remove?: boolean) => {
  const isProd = process.env.NODE_ENV === "production"
  let attributes: CookieOptions = {
    httpOnly: true,
    sameSite: "Lax",
    path: "/",
    maxAge: 31536000 // The cookie is set to never expire (by setting it to 1 year. Explanation provided below)
  }

  if (isProd) {
    const domain = process.env.DOMAIN
    if (!domain) {
      throw new Error("DOMAIN environment variable is required in production")
    }
    attributes = {
      ...attributes,
      sameSite: "Lax",
      domain,
      secure: true
    }
  }

  if (remove) {
    attributes.maxAge = 0
  }

  return attributes
}

const encodeUserId = (userId: number): string => {
  const encodingKey = process.env.USER_ENCODING_KEY || ""
  const secret = Buffer.from(encodingKey, "base64")

  const payload = { id: userId }

  // This JWT is specifically for backward compatibility with legacy services
  // and intentionally doesn't include an expiration time to match the original implementation.
  // Empty string is allowed for USER_ENCODING_KEY, again to match the original implementation.
  // Note: This cookie is NOT used for session validation in this application -
  // the better-auth library manages session security with its own cookies.
  const token = jwt.sign(payload, secret, {
    algorithm: "HS512",
    noTimestamp: true
  })

  return encodeURIComponent(token)
}

const JWT_COOKIE_NAME = "jwt"

export const setJwtCookie = (ctx: MiddlewareContext<MiddlewareOptions>, id: string) => {
  const encodedId = encodeUserId(Number(id))
  ctx.setCookie(JWT_COOKIE_NAME, encodedId, getCookieAttributes())
}

export const removeJwtCookie = (ctx: MiddlewareContext<MiddlewareOptions>) => {
  ctx.setCookie(JWT_COOKIE_NAME, "", getCookieAttributes(true))
}

export const getJwtCookie = (ctx: MiddlewareContext<MiddlewareOptions>) => {
  return ctx.getCookie(JWT_COOKIE_NAME)
}
