"use client";

import {
  IconDashboard,
  IconDotsVertical,
  IconLogout,
  IconSettings,
  IconUser,
  IconBell,
  IconCrown,
  IconSparkles,
  IconMoon,
  IconSun,
} from "@tabler/icons-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { HomeIcon, Tv2 } from "lucide-react";
import { useSignOut } from "@/hooks/use-signout";
import { useTheme } from "next-themes";
import { useState } from "react";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { data: session, isPending } = authClient.useSession();
  const handleSignout = useSignOut();
  const { theme, setTheme } = useTheme();
  const [notifications] = useState(3); // Mock notifications count

  if (isPending) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex items-center gap-2 px-2 py-2">
            <div className="size-8 rounded-lg bg-muted animate-pulse" />
            <div className="flex-1 space-y-2">
              <div className="h-3 bg-muted rounded animate-pulse" />
              <div className="h-2 bg-muted rounded w-2/3 animate-pulse" />
            </div>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  const userRole = session?.user?.role || "student";
  const isAdmin = userRole === "admin";
  const isInstructor = userRole === "instructor";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:bg-accent/80 transition-all duration-200 group"
            >
              <div className="relative">
                <Avatar className="h-8 w-8 rounded-lg ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                  <AvatarImage
                    src={
                      session?.user.image ??
                      `https://avatar.vercel.sh/${session?.user.email}`
                    }
                    alt={session?.user.name}
                  />
                  <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-semibold">
                    {session?.user.name && session.user.name.length > 0
                      ? session.user.name.charAt(0).toUpperCase()
                      : session?.user.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {(isAdmin || isInstructor) && (
                  <div className="absolute -bottom-1 -right-1 size-4 bg-primary rounded-full border-2 border-background flex items-center justify-center">
                    <IconCrown className="size-2.5 text-primary-foreground" />
                  </div>
                )}
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <div className="flex items-center gap-2">
                  <span className="truncate font-semibold">
                    {session?.user.name && session.user.name.length > 0
                      ? session.user.name
                      : session?.user.email.split("@")[0]}
                  </span>
                  {isAdmin && (
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0 h-4 bg-primary/20 text-primary border-primary/30"
                    >
                      Admin
                    </Badge>
                  )}
                  {isInstructor && (
                    <Badge
                      variant="secondary"
                      className="text-[10px] px-1.5 py-0 h-4 bg-orange-500/20 text-orange-500 border-orange-500/30"
                    >
                      Instructor
                    </Badge>
                  )}
                </div>
                <span className="text-muted-foreground truncate text-xs">
                  {session?.user.email}
                </span>
              </div>
              <IconDotsVertical className="ml-auto size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-72 rounded-xl shadow-xl border-border/50"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            {/* User Info Header */}
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 px-3 py-3 bg-gradient-to-br from-primary/5 to-transparent">
                <Avatar className="h-10 w-10 rounded-lg ring-2 ring-primary/20">
                  <AvatarImage
                    src={
                      session?.user.image ??
                      `https://avatar.vercel.sh/${session?.user.email}`
                    }
                    alt={session?.user.name}
                  />
                  <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-semibold">
                    {session?.user.name && session.user.name.length > 0
                      ? session.user.name.charAt(0).toUpperCase()
                      : session?.user.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    {session?.user.name && session.user.name.length > 0
                      ? session.user.name
                      : session?.user.email.split("@")[0]}
                  </span>
                  <span className="text-muted-foreground truncate text-xs">
                    {session?.user.email}
                  </span>
                  {(isAdmin || isInstructor) && (
                    <Badge
                      variant="outline"
                      className="w-fit mt-1 text-[10px] px-1.5 py-0 h-4"
                    >
                      {isAdmin ? "Administrator" : "Instructor"}
                    </Badge>
                  )}
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* Quick Actions */}
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link
                  href="/"
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <HomeIcon className="size-4" />
                  <span>Homepage</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <IconDashboard className="size-4" />
                  <span>My Dashboard</span>
                </Link>
              </DropdownMenuItem>
              {(isAdmin || isInstructor) && (
                <DropdownMenuItem asChild>
                  <Link
                    href="/admin"
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <IconSparkles className="size-4 text-primary" />
                    <span className="font-medium">Instructor Panel</span>
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link
                  href="/courses"
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <Tv2 className="size-4" />
                  <span>Browse Courses</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Settings & Preferences */}
            <DropdownMenuGroup>
              <DropdownMenuItem asChild>
                <Link
                  href="/profile"
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <IconUser className="size-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/notifications"
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <IconBell className="size-4" />
                  <span>Notifications</span>
                  {notifications > 0 && (
                    <Badge
                      variant="default"
                      className="ml-auto text-[10px] px-1.5 py-0 h-4 bg-primary/20 text-primary border-primary/30"
                    >
                      {notifications}
                    </Badge>
                  )}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href="/settings"
                  className="flex items-center gap-3 cursor-pointer"
                >
                  <IconSettings className="size-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex items-center gap-3 cursor-pointer"
              >
                {theme === "dark" ? (
                  <IconSun className="size-4" />
                ) : (
                  <IconMoon className="size-4" />
                )}
                <span>Toggle {theme === "dark" ? "Light" : "Dark"} Mode</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Logout */}
            <DropdownMenuItem
              onClick={handleSignout}
              className="text-red-500 focus:text-red-500 focus:bg-red-500/10 cursor-pointer"
            >
              <IconLogout className="size-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
