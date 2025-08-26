import { createAuthMiddleware } from "better-auth/api"
import { saveDefaultPreferences } from "@/server/auth/default-preferences"
import { getJwtCookie, removeJwtCookie, setJwtCookie } from "@/server/auth/jwt-hook"

// Endpoints that create a new session
const newSessionEndpoints = ["/verify-email", "/callback", "/sign-in"]

export const afterHook = createAuthMiddleware(async (ctx) => {
    const isNewSessionEndpoint = newSessionEndpoints.some((endpoint) =>
        ctx.path.startsWith(endpoint)
    )
    if (isNewSessionEndpoint && ctx.context.newSession) {
        const {
            user: { id }
        } = ctx.context.newSession
        setJwtCookie(ctx, id)

        // Save default preferences for the user if they don't have any
        await saveDefaultPreferences(Number(id))
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
