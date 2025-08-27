import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2">
        <Skeleton className="h-8 w-8 md:hidden" />
        <Skeleton className="h-9 w-48" />
      </div>
      <Skeleton className="mt-1 h-5 w-2/5" />
    </div>
  )
}
