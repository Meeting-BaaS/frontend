import { emailService } from "@/server/auth/emails-service"

/**
 * Save default preferences for an account
 * @param accountId - The account ID
 * @returns true if the preferences are saved successfully, false otherwise
 */
export const saveDefaultPreferences = async (accountId: number) => {
  await emailService("account/default-preferences", { accountId })
}
