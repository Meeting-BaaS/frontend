"use client"

import { usePathname } from "next/navigation"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar
} from "@/components/ui/sidebar"
import { domains } from "@/components/email-preferences/domains"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { KeyRound, Trash, Mail, Inbox } from "lucide-react"
import type { DomainConfig } from "@/lib/email-types"
import { broadcastRoutes, type BroadcastRoute } from "@/components/broadcasts/broadcast-routes"

type SidebarNavItem = {
  title: string
  href: string
  icon: React.ReactNode
  menuItems?: DomainConfig[] | BroadcastRoute[]
}

const sidebarNavItems: SidebarNavItem[] = [
  {
    title: "Credentials",
    href: "/credentials",
    icon: <KeyRound />
  },
  {
    title: "Email Preferences",
    href: "/email-preferences",
    menuItems: domains,
    icon: <Mail />
  },
  {
    title: "Delete Account",
    href: "/delete-account",
    icon: <Trash />
  }
]

const meetingBaasNavItems: SidebarNavItem[] = [
  {
    title: "Broadcasts",
    href: "/broadcasts",
    icon: <Inbox />,
    menuItems: broadcastRoutes
  }
]

export default function AppSidebar({
  className,
  meetingBaasUser,
  ...props
}: React.ComponentProps<typeof Sidebar> & { meetingBaasUser: boolean }) {
  const pathName = usePathname()
  const { setOpenMobile } = useSidebar()

  const navItems = meetingBaasUser ? [...meetingBaasNavItems, ...sidebarNavItems] : sidebarNavItems

  return (
    <Sidebar
      className={cn(
        "!h-[calc(100svh-var(--header-height))] top-[var(--header-height)] lg:mt-2.5",
        className
      )}
      {...props}
    >
      <SidebarHeader>
        <div className="mt-2 flex items-center gap-2 px-2">
          <h2 className="font-bold text-lg">Settings</h2>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild isActive={pathName.endsWith(item.href)}>
                  <Link
                    href={item.href}
                    className="font-medium"
                    onClick={() => setOpenMobile(false)}
                  >
                    {item.icon} {item.title}
                  </Link>
                </SidebarMenuButton>
                {item.menuItems?.length ? (
                  <SidebarMenuSub>
                    {item.menuItems.map((menuItem) => (
                      <SidebarMenuSubItem key={menuItem.name}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={pathName.endsWith(`${item.href}/${menuItem.type}`)}
                        >
                          <Link
                            href={`${item.href}/${menuItem.type}`}
                            onClick={() => setOpenMobile(false)}
                          >
                            {menuItem.name}
                          </Link>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
