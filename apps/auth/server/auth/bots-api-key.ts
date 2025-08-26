const secret = process.env.BOTS_API_KEY_SECRET
// Number of random bytes to generate for the API key
const RANDOM_BYTES_LENGTH = 32

if (!secret) {
    throw new Error(
        "BOTS_API_KEY_SECRET is not configured in env. Please set this in your .env file or deployment configuration."
    )
}

/**
 * Generate a secure API key for bots to authenticate with the system.
 * The key is created from random integers, combined with secret and hashed
 * @returns A 64-character hexadecimal string representing the SHA-256 hash
 */
export const generateBotsApiKey = async () => {
    // Step 1: Generate random 32-byte hex string
    const randomBytes = new Uint8Array(RANDOM_BYTES_LENGTH)
    crypto.getRandomValues(randomBytes)
    const randomHex = Array.from(randomBytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")

    // Step 2: Combine with secret
    const combined = randomHex + secret

    // Step 3: Hash the combination using SHA-256
    const buffer = new TextEncoder().encode(combined)
    const digest = await crypto.subtle.digest("SHA-256", buffer)
    const hashHex = Array.from(new Uint8Array(digest))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("")

    return hashHex
}
