import { Button } from "@repo/shared/components/ui/button"
import { V2_DASHBOARD_URL } from "@repo/shared/lib/external-urls"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

export const AccessV2Button = () => {
  return (
    <Button
      variant="outline"
      className="rainbow-border rounded-full ml-4 border-transparent px-2 py-1.5"
      asChild
      size="sm"
    >
      <Link href={V2_DASHBOARD_URL} target="_blank" rel="noopener noreferrer">
        <span className="flex items-center gap-2">
          Access Meeting BaaS v2
          <ExternalLink aria-hidden />
        </span>
      </Link>
    </Button>
  )
}
