"use client";

import * as React from "react";
import {
  IconDashboard,
  IconHelp,
  IconSearch,
  IconSettings,
  IconFileText,
  IconSchool,
  IconSparkles,
  IconUserCircle,
  IconBell,
} from "@tabler/icons-react";

import { NavMain } from "@/components/sidebar/nav-main";
import { NavSecondary } from "@/components/sidebar/nav-secondary";
import { NavUser } from "@/components/sidebar/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { data: session } = authClient.useSession();
  const [pendingCount, setPendingCount] = React.useState(0);
  
  const userRole = session?.user?.role;
  const isAdmin = userRole === "admin";
  const isInstructor = userRole === "instructor";

  // Fetch pending applications count (only for admins)
  React.useEffect(() => {
    if (!isAdmin) return;

    const fetchCount = async () => {
      try {
        const response = await fetch("/api/admin/applications/count");
        const data = await response.json();
        setPendingCount(data.count || 0);
      } catch (error) {
        console.error("Error fetching applications count:", error);
      }
    };

    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, [isAdmin]);

  // Main navigation
  const navMain = [
    {
      title: "Dashboard",
      url: "/admin",
      icon: IconDashboard,
      description: "Overview & Stats",
    },
    {
      title: "Courses",
      url: "/admin/courses",
      icon: IconSchool,
      description: "Manage your courses",
    },
    {
      title: "Applications",
      url: "/admin/applications",
      icon: IconFileText,
      description: isAdmin ? "Review instructor requests" : "View your application",
      badge: isAdmin && pendingCount > 0 ? pendingCount : undefined,
      badgeVariant: "default" as const,
    },
    {
      title: "Edit Profile",
      url: "/admin/profile",
      icon: IconUserCircle,
      description: "Update your information",
    },
  ];

  // Secondary navigation
  const navSecondary = [
    {
      title: "Notifications",
      url: "/admin/notifications",
      icon: IconBell,
      badge: 3,
    },
    {
      title: "Settings",
      url: "/admin/settings",
      icon: IconSettings,
    },
    {
      title: "Get Help",
      url: "/admin/help",
      icon: IconHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: IconSearch,
    },
  ];

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      {/* Premium Header */}
      <SidebarHeader className="border-b border-border/50">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-2 hover:bg-accent/50 transition-all duration-200"
            >
              <Link href="/">
                <div className="relative">
                  <Image 
                    src="/logo123.PNG" 
                    alt="logo" 
                    width={40} 
                    height={40}
                    className="rounded-lg"
                  />
                  {isAdmin && (
                    <div className="absolute -top-1 -right-1 size-3 bg-primary rounded-full border-2 border-background animate-pulse" />
                  )}
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-base font-bold truncate">Paramount</span>
                  <div className="flex items-center gap-1.5">
                    <Badge 
                      variant="secondary" 
                      className="text-[10px] px-1.5 py-0 h-4"
                    >
                      {isAdmin ? "Admin" : "Instructor"}
                    </Badge>
                    <IconSparkles className="size-3 text-primary" />
                  </div>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="px-2">
        {/* Quick Create Button */}
        <div className="px-2 py-3">
          <Button 
            asChild 
            className="w-full bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20"
          >
            <Link href="/admin/courses">
              <IconSparkles className="size-4 mr-2" />
              Quick Create
            </Link>
          </Button>
        </div>

        <Separator className="my-2" />

        {/* Main Navigation */}
        <div className="space-y-1">
          <p className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Main Menu
          </p>
          <NavMain items={navMain} />
        </div>

        {/* Secondary Navigation */}
        <Separator className="my-2" />
        <NavSecondary items={navSecondary} className="mt-auto" />

        {/* Back to Learning Link */}
        <div className="px-3 py-4 mt-4 border-t border-border/50">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">←</span>
            <span>Back to Learning</span>
          </Link>
        </div>
      </SidebarContent>

      {/* Premium Footer */}
      <SidebarFooter className="border-t border-border/50">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
