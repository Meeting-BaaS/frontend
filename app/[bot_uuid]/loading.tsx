import { Loader2 } from "lucide-react"

export default function ViewerLoading() {
  return (
    <div className="flex h-[calc(100%-12rem)] w-full grow items-center justify-center">
      <Loader2 className="size-8 animate-spin text-primary" />
    </div>
  )
}
