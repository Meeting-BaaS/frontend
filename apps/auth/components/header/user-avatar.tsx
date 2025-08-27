"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@repo/shared/components/ui/avatar"
import { Button } from "@repo/shared/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@repo/shared/components/ui/dropdown-menu"
import type { User } from "better-auth"
import { Loader2, UserIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Fragment, useState } from "react"
import { toast } from "sonner"
import { menuOptions } from "@/components/header/menu-options"
import { ThemeToggle } from "@/components/header/theme-toggle"
import { signOut } from "@/lib/auth-client"
import { genericError } from "@/lib/errors"

export const UserAvatar = ({ user }: { user: User }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const onSignOut = async () => {
    try {
      await signOut({
        fetchOptions: {
          onRequest: () => {
            setLoading(true)
          },
          onResponse: () => {
            setLoading(false)
          },
          onSuccess: () => {
            router.push("/sign-in")
          },
          onError: (ctx) => {
            toast.error(ctx.error.message)
          }
        }
      })
    } catch (_error) {
      setLoading(false)
      toast.error(genericError)
    }
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
            <DropdownMenuItem asChild>
              <Link
                rel="noopener noreferrer"
                href={menuOption.href}
                target="_blank"
                className="cursor-pointer"
              >
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
