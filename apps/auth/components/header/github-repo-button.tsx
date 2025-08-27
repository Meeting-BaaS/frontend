import { GitHubLogo } from "@repo/shared/components/icons/github"
import { Button } from "@repo/shared/components/ui/button"
import { GITHUB_REPO_URL } from "@repo/shared/lib/external-urls"
import Link from "next/link"

export const GitHubRepoButton = () => {
  return (
    <Button variant="outline" className="fill-foreground px-2 py-1.5" asChild>
      <Link href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer">
        <span className="flex items-center gap-2">
          <GitHubLogo aria-hidden />
          GitHub
        </span>
      </Link>
    </Button>
  )
}
