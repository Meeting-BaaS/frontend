import { useQuery, useMutation } from "@tanstack/react-query"
import { fetchSubscriptionsInfo, initiatePurchase, openBillingPortal } from "@/lib/subscription/api"
import { toast } from "sonner"
import type { SubscriptionResponse } from "@/lib/subscription/types"

export function useSubscription(initialSubscription?: SubscriptionResponse) {
  const {
    data: subscription,
    isLoading: isSubscriptionLoading,
    isRefetching: isSubscriptionRefetching,
    isError: isSubscriptionError,
    error: subscriptionError
  } = useQuery({
    queryKey: ["subscription"],
    queryFn: fetchSubscriptionsInfo,
    retry: 2,
    initialData: initialSubscription,
    refetchOnMount: false,
    refetchOnWindowFocus: true
  })

  const purchaseMutation = useMutation({
    mutationFn: initiatePurchase,
    onSuccess: (response) => {
      if (response.url) {
        window.location.href = response.url
        toast.success("Purchase initiated")
      } else {
        console.error("Response didn't contain a url to initiate purchase", response)
        toast.error("Failed to initiate purchase. Please try again.")
      }
    },
    onError: (error) => {
      console.error("Failed to initiate purchase", error)
      toast.error("Failed to initiate purchase. Please try again.")
    }
  })

  const billingPortalMutation = useMutation({
    mutationFn: openBillingPortal,
    onSuccess: (response) => {
      if (response.url) {
        window.open(response.url, "_blank")
        toast.success("Billing portal opened")
      } else {
        console.error("Response didn't contain a url to open billing portal", response)
        toast.error("Failed to open billing portal. Please try again.")
      }
    },
    onError: (error) => {
      console.error("Failed to open billing portal", error)
      toast.error("Failed to open billing portal. Please try again.")
    }
  })

  return {
    // Fetch subscription info
    subscription,
    isSubscriptionLoading,
    isSubscriptionRefetching,
    isSubscriptionError,
    subscriptionError,

    // Purchase
    initiatePurchase: purchaseMutation.mutate,
    initiatePurchaseLoading: purchaseMutation.isPending,

    // Billing portal
    openBillingPortal: billingPortalMutation.mutate,
    openBillingPortalLoading: billingPortalMutation.isPending
  }
}
