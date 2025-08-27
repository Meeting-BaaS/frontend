import { useQuery } from "@tanstack/react-query"
import { getWebhookUrl } from "@/lib/api/webhook-api"
import { toast } from "sonner"

export function useWebhook() {
  // Query for fetching webhook url
  // Ensures that the webhook url is always up to date
  const {
    data: webhookUrl,
    isLoading,
    isError: isErrorWebhookUrl,
    isRefetching,
    isRefetchError
  } = useQuery({
    queryKey: ["webhook-url"],
    queryFn: () => getWebhookUrl(),
    refetchOnWindowFocus: true
  })

  if (isErrorWebhookUrl || isRefetchError) {
    toast.error("Failed to fetch webhook url. Please try again.")
  }

  return {
    webhookUrl,
    isLoadingWebhookUrl: isLoading || isRefetching,
    isErrorWebhookUrl: isErrorWebhookUrl || isRefetchError
  }
}
