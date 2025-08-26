import Link from "next/link"
import { Button } from "@/components/ui/button"
import { GitHubLogo } from "@/components/icons/github"
import { GITHUB_REPO_URL } from "@/lib/external-urls"

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
