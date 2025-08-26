/**
 * Call an email service endpoint
 * @param endpoint - The endpoint to call
 * @param body - The body of the request
 * @returns The response from the email service
 */
export const emailService = async (endpoint: string, body: object) => {
    const emailServiceUrl = process.env.EMAIL_API_SERVER_BASEURL
    const emailServiceApiKey = process.env.EMAIL_SERVICE_API_KEY

    if (!emailServiceApiKey)
        throw new Error(
            "EMAIL_SERVICE_API_KEY is not set. Please set it in the environment variables."
        )

    if (!emailServiceUrl)
        throw new Error(
            "EMAIL_API_SERVER_BASEURL is not set. Please set it in the environment variables."
        )

    try {
        const response = await fetch(`${emailServiceUrl}/${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": emailServiceApiKey
            },
            body: JSON.stringify(body)
        })

        if (!response.ok) {
            const errorText = await response.text()
            throw new Error(
                `Failed to call email service endpoint ${endpoint}: ${response.status} ${response.statusText}. ${errorText}`
            )
        }
        return await response.json()
    } catch (error) {
        console.error(`Error calling email service endpoint ${endpoint}:`, error)
        throw error
    }
}
