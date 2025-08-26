import { emailService } from "@/server/auth/emails-service"

/**
 * Send a verification email to the user upon sign up
 * @param firstName - The first name of the user
 * @param email - The email address of the user
 * @param url - The URL to verify the email
 * @throws {Error} If the email service fails or environment variables are missing
 */
export const sendVerificationEmail = async (firstName: string, email: string, url: string) => {
    await emailService("account/verification-email", { firstName, email, url })
}

/**
 * Send a password reset email to the user
 * @param firstName - The first name of the user
 * @param email - The email address of the user
 * @param url - The URL to reset the password
 * @throws {Error} If the email service fails or environment variables are missing
 */
export const sendPasswordResetEmail = async (firstName: string, email: string, url: string) => {
    await emailService("account/password-reset-email", { firstName, email, url })
}
