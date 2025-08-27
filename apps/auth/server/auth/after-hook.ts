import { createAuthMiddleware } from "better-auth/api"
import { saveDefaultPreferences } from "@/server/auth/default-preferences"
import { getJwtCookie, removeJwtCookie, setJwtCookie } from "@/server/auth/jwt-hook"

// Endpoints that create a new session
const newSessionEndpoints = ["/verify-email", "/callback", "/sign-in"]

export const afterHook = createAuthMiddleware(async (ctx) => {
  const isNewSessionEndpoint = newSessionEndpoints.some((endpoint) => ctx.path.startsWith(endpoint))
  if (isNewSessionEndpoint && ctx.context.newSession) {
    const {
      user: { id }
    } = ctx.context.newSession
    setJwtCookie(ctx, id)

    // Save default preferences for the user if they don't have any
    // Do this only if the email service is configured
    if (process.env.EMAIL_API_SERVER_BASEURL && process.env.EMAIL_SERVICE_API_KEY) {
      await saveDefaultPreferences(Number(id))
    }
  } else if (ctx.path.startsWith("/get-session") && ctx.context.session) {
    const jwt = getJwtCookie(ctx)
    // if the jwt has been removed/expired, set it again for an active session
    if (!jwt) {
      const {
        user: { id }
      } = ctx.context.session
      setJwtCookie(ctx, id)
    }
  } else if (ctx.path.startsWith("/sign-out")) {
    removeJwtCookie(ctx)
  }
})
