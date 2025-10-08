"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ThemeToggle } from "../ui/themeToggle";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  IconBell,
  IconSearch,
  IconSparkles,
  IconPlus,
  IconCommand,
} from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useState, useEffect } from "react";

export function SiteHeader() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const [notifications, setNotifications] = useState(3);
  const [searchOpen, setSearchOpen] = useState(false);

  // Get breadcrumb from path
  const getBreadcrumb = () => {
    const paths = pathname.split("/").filter(Boolean);
    if (paths.length === 0) return "Dashboard";
    
    const lastPath = paths[paths.length - 1];
    return lastPath.charAt(0).toUpperCase() + lastPath.slice(1).replace(/-/g, " ");
  };

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const isAdmin = session?.user?.role === "admin";
  const isInstructor = session?.user?.role === "instructor";

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height) sticky top-0 z-40">
      <div className="flex w-full items-center gap-2 px-4 lg:gap-4 lg:px-6">
        {/* Left Section: Menu + Breadcrumb */}
        <div className="flex items-center gap-2 lg:gap-4">
          <SidebarTrigger className="-ml-1 hover:bg-accent/80 transition-colors" />
          <Separator
            orientation="vertical"
            className="mx-2 data-[orientation=vertical]:h-5"
          />
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent hidden md:block">
              Paramount
            </h1>
            <Separator
              orientation="vertical"
              className="mx-2 data-[orientation=vertical]:h-4 hidden md:block"
            />
            <span className="text-sm text-muted-foreground font-medium">
              {getBreadcrumb()}
            </span>
          </div>
        </div>

        {/* Center Section: Search (Desktop) */}
        <div className="hidden lg:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              placeholder="Search courses, students, analytics..."
              className="pl-9 pr-20 bg-accent/50 border-border/50 focus:bg-background transition-colors"
              onClick={() => setSearchOpen(true)}
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <IconCommand className="size-3" />K
            </kbd>
          </div>
        </div>

        {/* Right Section: Actions */}
        <div className="ml-auto flex items-center gap-2">
          {/* Mobile Search */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSearchOpen(true)}
          >
            <IconSearch className="size-4" />
          </Button>

          {/* Quick Create (Admin/Instructor) */}
          {(isAdmin || isInstructor) && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="default"
                  size="sm"
                  className="gap-2 bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
                >
                  <IconPlus className="size-4" />
                  <span className="hidden md:inline">Create</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>Quick Create</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/admin/courses/new" className="cursor-pointer">
                    <IconSparkles className="size-4 mr-2" />
                    New Course
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/admin/chapters/new" className="cursor-pointer">
                    <IconPlus className="size-4 mr-2" />
                    New Chapter
                  </Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin/announcements/new" className="cursor-pointer">
                      <IconBell className="size-4 mr-2" />
                      New Announcement
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {/* Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <IconBell className="size-4" />
                {notifications > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 size-5 rounded-full p-0 flex items-center justify-center text-[10px] animate-pulse"
                  >
                    {notifications}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel className="flex items-center justify-between">
                <span>Notifications</span>
                <Badge variant="secondary" className="text-[10px]">
                  {notifications} new
                </Badge>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <div className="max-h-[300px] overflow-y-auto">
                <DropdownMenuItem className="flex-col items-start gap-1 py-3">
                  <div className="flex items-center gap-2 w-full">
                    <div className="size-2 rounded-full bg-primary animate-pulse" />
                    <span className="font-medium text-sm">New student enrolled</span>
                    <span className="text-xs text-muted-foreground ml-auto">2m ago</span>
                  </div>
                  <p className="text-xs text-muted-foreground pl-4">
                    John Doe enrolled in "Advanced React Course"
                  </p>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex-col items-start gap-1 py-3">
                  <div className="flex items-center gap-2 w-full">
                    <div className="size-2 rounded-full bg-primary animate-pulse" />
                    <span className="font-medium text-sm">Course completed</span>
                    <span className="text-xs text-muted-foreground ml-auto">1h ago</span>
                  </div>
                  <p className="text-xs text-muted-foreground pl-4">
                    Sarah completed "Web Development Basics"
                  </p>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex-col items-start gap-1 py-3">
                  <div className="flex items-center gap-2 w-full">
                    <div className="size-2 rounded-full bg-green-500" />
                    <span className="font-medium text-sm">Revenue milestone</span>
                    <span className="text-xs text-muted-foreground ml-auto">3h ago</span>
                  </div>
                  <p className="text-xs text-muted-foreground pl-4">
                    You've reached $10,000 in revenue! 🎉
                  </p>
                </DropdownMenuItem>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild className="justify-center">
                <Link href="/admin/notifications" className="cursor-pointer text-primary">
                  View all notifications
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Role Badge */}
          {(isAdmin || isInstructor) && (
            <Badge
              variant="secondary"
              className="hidden md:flex text-[10px] px-2 py-1 bg-primary/20 text-primary border-primary/30"
            >
              <IconSparkles className="size-3 mr-1" />
              {isAdmin ? "Admin" : "Instructor"}
            </Badge>
          )}
        </div>
      </div>
    </header>
  );
}
