import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useEffect } from "react"
import { toast } from "sonner"
import { deleteContent, getContents, updateContent } from "@/lib/api/broadcast-api"
import type { Content, ContentMutationError } from "@/lib/broadcast-types"
import type { ContentFormValues } from "@/lib/schemas/content"

export function useContents() {
  const queryClient = useQueryClient()
  // Query for fetching contents
  const {
    data: contents,
    isLoading,
    isError: isErrorContents,
    isRefetching,
    isRefetchError
  } = useQuery<Content[]>({
    queryKey: ["contents"],
    queryFn: () => getContents(),
    staleTime: 1000 * 60 * 15, // 15 minutes
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData
  })

  useEffect(() => {
    if (isErrorContents || isRefetchError) {
      toast.error("Failed to fetch contents. Please try again.")
    }
  }, [isErrorContents, isRefetchError])

  // Mutation for updating individual content
  const updateContentMutation = useMutation({
    mutationFn: async ({ id, content }: { id: number; content: ContentFormValues }) => {
      // Store the current state before updating
      const previousState = queryClient.getQueryData<Content[]>(["contents"])!

      // Update the cache optimistically
      queryClient.setQueryData(["contents"], (old: Content[]) =>
        old.map((oldContent) => (oldContent.id === id ? { ...oldContent, ...content } : oldContent))
      )

      try {
        const result = await updateContent(content, id)
        return { result, previousState }
      } catch (error) {
        // Attach the previous state to the error
        ;(error as ContentMutationError).previousState = previousState
        throw error
      }
    },
    onSuccess: () => {
      toast.success("Content updated successfully")
    },
    onError: (error: ContentMutationError) => {
      console.error("Failed to update content", error)
      // Revert the cache on error using the stored previous state
      queryClient.setQueryData(["contents"], (old: Content[]) => {
        const previousState = error.previousState
        return previousState || old
      })
      toast.error("Failed to update content. Please try again.")
    }
  })

  // Mutation for deleting individual content
  const deleteContentMutation = useMutation({
    mutationFn: async ({ id }: { id: number }) => {
      // Store the current state before updating
      const previousState = queryClient.getQueryData(["contents"]) as Content[]

      // Update the cache optimistically
      queryClient.setQueryData(["contents"], (old: Content[]) =>
        old.filter((content) => content.id !== id)
      )

      try {
        const result = await deleteContent(id)
        return { result, previousState }
      } catch (error) {
        // Attach the previous state to the error
        ;(error as ContentMutationError).previousState = previousState
        throw error
      }
    },
    onSuccess: () => {
      toast.success("Content deleted successfully")
    },
    onError: (error: ContentMutationError) => {
      console.error("Failed to delete content", error)
      // Revert the cache on error using the stored previous state
      queryClient.setQueryData(["contents"], (old: Content[]) => {
        const previousState = error.previousState
        return previousState || old
      })
      toast.error("Failed to delete content. Please try again.")
    }
  })

  return {
    contents,
    isLoadingContents: isLoading,
    isRefetchingContents: isRefetching,
    isErrorContents: isErrorContents || isRefetchError,
    updateContent: updateContentMutation.mutate,
    isUpdatingContent: updateContentMutation.isPending,
    deleteContent: deleteContentMutation.mutate,
    isDeletingContent: deleteContentMutation.isPending
  }
}
