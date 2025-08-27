"use client"

import { signOut } from "@repo/shared/auth/sign-out"
import type { User } from "@repo/shared/auth/types"
import { menuOptions } from "@repo/shared/components/layout/header/menu-options"
import { ThemeToggle } from "@repo/shared/components/layout/header/theme-toggle"
import { Loader2, UserIcon } from "lucide-react"
import Link from "next/link"
import { Fragment, useState } from "react"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { genericError } from "../../../lib/errors"

interface UserAvatarProps {
  user: User
  currentPath: string
}

export const UserAvatar = ({ user, currentPath }: UserAvatarProps) => {
  const [loading, setLoading] = useState(false)

  const onSignOut = async () => {
    setLoading(true)
    const signedOut = await signOut()
    if (!signedOut) {
      toast.error(genericError)
      setLoading(false)
      return
    }
    window.location.href = "/"
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          size="icon"
          className="h-7 w-7 rounded-full border-0 bg-transparent p-0"
          aria-label="User menu"
        >
          {loading ? (
            <Loader2 className="size-4.5 animate-spin stroke-primary" aria-label="Loading" />
          ) : (
            <Avatar className="border" aria-label="user menu">
              <AvatarImage src={user.image ?? undefined} />
              <AvatarFallback className="bg-primary">
                <UserIcon className="size-4.5" />
              </AvatarFallback>
            </Avatar>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48">
        <DropdownMenuLabel className="truncate text-muted-foreground first-letter:uppercase">
          {user.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="hover:!bg-popover inline-flex w-full justify-between py-1 md:hidden"
          onSelect={(e: Event) => {
            e.preventDefault()
          }}
        >
          <p>Theme</p>
          <ThemeToggle />
        </DropdownMenuItem>
        <DropdownMenuSeparator className="md:hidden" />
        {menuOptions.map((menuOption) => (
          <Fragment key={menuOption.title}>
            {menuOption.separator && <DropdownMenuSeparator />}
            <DropdownMenuItem asChild disabled={menuOption.href === currentPath}>
              <Link href={menuOption.href} className="cursor-pointer">
                {menuOption.title}
              </Link>
            </DropdownMenuItem>
          </Fragment>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <button type="button" className="w-full cursor-pointer" onClick={onSignOut}>
            Sign out
          </button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
