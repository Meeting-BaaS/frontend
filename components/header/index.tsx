import { UserAvatar } from "@/components/header/user-avatar"
import Image from "next/image"
import { ThemeToggle } from "@/components/header/theme-toggle"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { GitHubLogo } from "@/components/icons/github"
import type { User } from "@/lib/auth/types"
import { GITHUB_REPO_URL, LOGS_URL } from "@/lib/external-urls"
import { getAuthAppUrl } from "@/lib/auth/auth-app-url"
import { ChevronLeft } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

export default function Header({ user }: { user: User }) {
  /**
   * Navigate back to the logs page. If the page is opened in a new tab,
   * close the current tab and navigate to the logs page.
   * If the page is opened directly, navigate to the logs page.
   */
  const handleBackClick = () => {
    if (window.opener && !window.opener.closed) {
      window.close()
      setTimeout(() => {
        // Just in case close() is blocked by the browser
        window.location.href = LOGS_URL
      }, 500)
    } else {
      window.location.href = LOGS_URL
    }
  }
  return (
    <header className="sticky top-0 z-50 mx-auto box-content w-full max-w-container border-b bg-background/15 backdrop-blur-md lg:top-2 lg:mt-2 lg:w-[calc(100%-4rem)] lg:rounded-2xl lg:border">
      <nav className="flex h-12 w-full flex-row items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Back to logs"
                onClick={handleBackClick}
              >
                <ChevronLeft />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Back to logs</p>
            </TooltipContent>
          </Tooltip>
          <Link href={`${getAuthAppUrl()}/home`} target="_blank" rel="noopener noreferrer">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.svg"
                alt="Meeting BaaS logo"
                priority
                width={20}
                height={20}
                className="h-5 w-5"
              />
              <span className="font-bold text-md">Meeting BaaS</span>
            </div>
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="fill-foreground"
              asChild
              aria-label="Github repository"
            >
              <Link href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer">
                <GitHubLogo />
              </Link>
            </Button>
            <ThemeToggle className="hidden md:flex" />
          </div>
          <UserAvatar user={user} />
        </div>
      </nav>
    </header>
  )
}
