import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import dayjs from "dayjs"
import utc from "dayjs/plugin/utc"
import { useState } from "react"
import { toast } from "sonner"
import { getUpdatedDomainFrequency } from "@/components/email-preferences/domain-frequency"
import {
  getEmailPreferences,
  resendLatestEmail,
  updateEmailFrequency,
  updateServiceFrequency
} from "@/lib/api/email-api"
import type {
  EmailDomain,
  EmailFrequency,
  EmailPreferences,
  EmailType,
  MutationError,
  ResendError
} from "@/lib/email-types"

dayjs.extend(utc)

export function useEmailPreferences() {
  const queryClient = useQueryClient()
  const [resendingEmailIds, setResendingEmailIds] = useState<string[]>([])

  // Query for fetching email preferences
  const { data: preferences, isLoading } = useQuery({
    queryKey: ["email-preferences"],
    queryFn: () => getEmailPreferences(),
    retry: 2,
    refetchOnWindowFocus: true,
    staleTime: 1000 * 60 * 5, // 5 minutes,
    throwOnError: true // Page needs to show error boundary if this fails
  })

  // Mutation for updating individual email frequency
  const updatePreferenceMutation = useMutation({
    mutationFn: async ({ id, frequency }: { id: string; frequency: EmailFrequency }) => {
      // Store the current state before updating
      const previousState = queryClient.getQueryData(["email-preferences"]) as EmailPreferences

      // Update the cache optimistically
      queryClient.setQueryData(["email-preferences"], (old: EmailPreferences) => ({
        ...old,
        [id]: frequency
      }))

      try {
        const result = await updateEmailFrequency(id, frequency)
        return { result, previousState }
      } catch (error) {
        // Attach the previous state to the error
        ;(error as MutationError).previousState = previousState
        throw error
      }
    },
    onSuccess: () => {
      toast.success("Preference updated successfully")
    },
    onError: (error: MutationError) => {
      console.error("Failed to update preference", error)
      // Revert the cache on error using the stored previous state
      queryClient.setQueryData(["email-preferences"], (old: EmailPreferences) => {
        const previousState = error.previousState
        return previousState || old
      })
      toast.error("Failed to update preference. Please try again.")
    }
  })

  // Mutation for updating service-wide frequency
  const updateServiceMutation = useMutation({
    mutationFn: async ({
      domain,
      frequency,
      emailTypes
    }: {
      domain: EmailDomain
      frequency: EmailFrequency
      emailTypes: EmailType[]
    }) => {
      // Store the current state before updating
      const previousState = queryClient.getQueryData(["email-preferences"]) as EmailPreferences

      // Calculate new preferences before making the API call
      const newPreferences = getUpdatedDomainFrequency(domain, frequency, previousState, emailTypes)

      // Update the cache optimistically
      queryClient.setQueryData(["email-preferences"], newPreferences)

      try {
        const result = await updateServiceFrequency(domain, frequency)
        return { result, previousState }
      } catch (error) {
        // Attach the previous state to the error
        ;(error as MutationError).previousState = previousState
        throw error
      }
    },
    onSuccess: () => {
      toast.success("Preferences updated successfully")
    },
    onError: (error: MutationError, { domain }) => {
      console.error("Failed to update preferences", error)
      // Revert the cache on error using the stored previous state
      queryClient.setQueryData(["email-preferences"], (old: EmailPreferences) => {
        const previousState = error.previousState
        return previousState || old
      })
      toast.error(`Failed to update ${domain} preferences. Please try again.`)
    }
  })

  // Mutation for resending latest email
  const resendLatestMutation = useMutation({
    mutationFn: ({ emailId, frequency }: { emailId: string; frequency: EmailFrequency }) => {
      setResendingEmailIds((prev) => [...prev, emailId])
      return resendLatestEmail(emailId, frequency)
    },
    onSuccess: (data, { emailId }) => {
      toast.success(data.message || "Latest email will be resent shortly")
      setResendingEmailIds((prev) => prev.filter((id) => id !== emailId))
    },
    onError: (error: ResendError, { emailId }) => {
      console.error("Failed to resend email", error)
      // If the error is a resend error, show a toast with the next available at
      if (error.nextAvailableAt) {
        toast.error(
          `Too many requests. Please try again at ${dayjs
            .utc(error.nextAvailableAt)
            .local()
            .format("D MMM YYYY h:mm:ss A")}`
        )
      } else if (error.message === "422") {
        toast.error("No email found. Please wait for an email to be sent.")
      } else {
        toast.error("Failed to resend email. Please try again.")
      }
      setResendingEmailIds((prev) => prev.filter((id) => id !== emailId))
    }
  })

  return {
    preferences,
    isLoading,
    updatePreference: updatePreferenceMutation.mutate,
    updateService: updateServiceMutation.mutate,
    resendLatest: resendLatestMutation.mutate,
    isResendingEmail: (emailId: string) =>
      resendLatestMutation.isPending && resendingEmailIds.includes(emailId)
  }
}
