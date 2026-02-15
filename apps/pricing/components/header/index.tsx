"use client"

import { getSignInUrl } from "@repo/shared/auth/auth-app-url"
import { GitHubLogo } from "@repo/shared/components/icons/github"
import { ThemeToggle } from "@repo/shared/components/layout/header/theme-toggle"
import { ZoomTokenAlert } from "@repo/shared/components/layout/zoom-token-alert"
import { Button } from "@repo/shared/components/ui/button"
import { GITHUB_REPO_URL, MEETING_BAAS_HOMEPAGE_URL } from "@repo/shared/lib/external-urls"
import Image from "next/image"
import Link from "next/link"

export default function Header() {
  const onSignIn = () => {
    window.location.href = getSignInUrl()
  }

  return (
    <>
      <header className="sticky top-0 z-40 mx-auto box-content w-full max-w-container border-b bg-background/15 backdrop-blur-md lg:top-2 lg:mt-2 lg:w-[calc(100%-4rem)] lg:rounded-2xl lg:border">
        <nav className="flex h-12 w-full flex-row items-center justify-between px-4">
          <Link href={`${MEETING_BAAS_HOMEPAGE_URL}`}>
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
            <Button size="sm" className="h-7 text-xs" onClick={onSignIn}>
              Sign in
            </Button>
          </div>
        </nav>
      </header>
      <ZoomTokenAlert />
    </>
  )
}
