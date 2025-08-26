"use client"

import { useQuery } from "@tanstack/react-query"
import { getSession } from "@/lib/auth-client"
import type { SessionObject } from "@/lib/types"

export function useSession(initialSession?: SessionObject) {
    const { data: session, error } = useQuery<SessionObject>({
        queryKey: ["session"],
        queryFn: async () => {
            const { data: session, error } = await getSession()
            if (error) {
                console.error("Error fetching session", error)
                // Error caught by the query client
                throw error
            }
            return session as SessionObject
        },
        initialData: initialSession,
        staleTime: 0,
        // Refetch session on window focus, to ensure session is up to date
        refetchOnWindowFocus: true,
        // Don't refetch on mount since layout already has the initial session
        refetchOnMount: false,
        retry: false
    })

    return { session, error }
}
