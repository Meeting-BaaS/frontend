import { users } from "@/database/accounts-schema"
import { db } from "@/database/db"
import { eq, sql, type SQL } from "drizzle-orm"
import type { AnyPgColumn } from "drizzle-orm/pg-core"

/**
 * Utility function to split user's name
 * @param name full name
 * @returns Array with first name and last name
 */
export const splitName = (name: string) => {
  const [first = null, ...rest] = name.trim().split(" ")
  return [first, rest.length ? rest.join(" ") : null]
}

/**
 * Utility function to get lowercase column value
 * @param column PgColumn
 * @returns SQL
 */
export const lower = (column: AnyPgColumn): SQL => {
  return sql`lower(${column})`
}

/**
 * Update user's name and image with latest data from the provider using their email
 * @param name name
 * @param email email
 * @param image image
 */
export const updateUserProfile = async (name: string, email: string, image?: string) => {
  try {
    const [firstname, lastname] = splitName(name)

    // Fetch current user data
    const user = await db
      .select()
      .from(users)
      .where(eq(lower(users.email), email.toLowerCase()))

    // User doesn't exist. better-auth will handle user creation
    if (!user.length) return

    // Check if any values have actually changed
    const shouldUpdate = user[0].name !== name || (image && user[0].image !== image)

    if (!shouldUpdate) return

    await db
      .update(users)
      .set({
        ...(image ? { image } : {}),
        name,
        firstname,
        lastname,
        updatedAt: new Date()
      })
      .where(eq(lower(users.email), email.toLowerCase()))
  } catch (error) {
    console.error("Error updating user profile", error)
  }
}
