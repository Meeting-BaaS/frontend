import type { ExtendedUser, Session, User } from "better-auth"

// Extend the User type to include our additional fields
declare module "better-auth" {
    interface ExtendedUser extends User {
        firstname: string | null
        lastname: string | null
        status: number
        phone: string | null
        companyName: string | null
        companySize: string | null
        usagePlanned: string | null
        botsWebhook: string | null
        botsApiKey: string | null
    }
}

/**
 * Combined type that represents the session and user data.
 */
export type SessionObject = {
    session: Session
    user: ExtendedUser
}
