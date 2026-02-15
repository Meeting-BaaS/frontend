import { getAuthAppUrl } from "@repo/shared/auth/auth-app-url"
import type { User } from "@repo/shared/auth/types"
import { GitHubLogo } from "@repo/shared/components/icons/github"
import { IntroducingV2Button } from "@repo/shared/components/layout/header/introducing-v2-button"
import { ThemeToggle } from "@repo/shared/components/layout/header/theme-toggle"
import { UserAvatar } from "@repo/shared/components/layout/header/user-avatar"
import { ZoomTokenAlert } from "@repo/shared/components/layout/zoom-token-alert"
import { Button } from "@repo/shared/components/ui/button"
import { GITHUB_REPO_URL } from "@repo/shared/lib/external-urls"
import { cn } from "@repo/shared/lib/utils"
import Image from "next/image"
import Link from "next/link"

interface HeaderProps {
  user: User
  currentPath: string
  headerClassName?: string
  hideZoomTokenAlert?: boolean
}

export default function Header({
  user,
  currentPath,
  headerClassName,
  hideZoomTokenAlert
}: HeaderProps) {
  return (
    <>
      <header
        className={cn(
          "mx-auto box-content w-full max-w-container border-b bg-background/15 backdrop-blur-md lg:top-2 lg:mt-2 lg:w-[calc(100%-4rem)] lg:rounded-2xl lg:border",
          headerClassName
        )}
      >
        <nav className="flex h-12 w-full flex-row items-center justify-between px-4">
          <Link href={`${getAuthAppUrl()}/home`}>
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
              <IntroducingV2Button />
            </div>
          </Link>
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
            <UserAvatar user={user} currentPath={currentPath} />
          </div>
        </nav>
      </header>
      {!hideZoomTokenAlert && <ZoomTokenAlert />}
    </>
  )
}
