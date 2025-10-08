"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    url: string;
    icon: any;
    badge?: number | string;
    badgeVariant?: "default" | "secondary" | "outline" | "destructive";
    shortcut?: string;
    description?: string;
    isExternal?: boolean;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname();

  const handleKeyboardShortcut = React.useCallback(
    (e: KeyboardEvent, url: string) => {
      items.forEach((item) => {
        if (item.shortcut && e.key === item.shortcut && (e.metaKey || e.ctrlKey)) {
          e.preventDefault();
          window.location.href = url;
        }
      });
    },
    [items]
  );

  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      items.forEach((item) => {
        if (item.shortcut) {
          handleKeyboardShortcut(e, item.url);
        }
      });
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [items, handleKeyboardShortcut]);

  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu className="space-y-1">
          {items.map((item) => {
            // ✅ Build tooltip text as a string instead of JSX
            let tooltipText = item.title;
            if (item.description) {
              tooltipText += ` - ${item.description}`;
            }
            
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={tooltipText}  // ✅ Pass simple string
                  className={cn(
                    "group hover:bg-accent/60 transition-all duration-200 relative",
                    pathname === item.url &&
                      "bg-accent text-foreground font-medium"
                  )}
                >
                  {item.isExternal ? (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center w-full"
                    >
                      {item.icon && (
                        <item.icon
                          className={cn(
                            "size-4 text-muted-foreground transition-all group-hover:text-foreground group-hover:scale-110",
                            pathname === item.url && "text-foreground"
                          )}
                        />
                      )}
                      <span className="text-sm">{item.title}</span>
                      {item.badge && (
                        <Badge
                          variant={item.badgeVariant || "secondary"}
                          className={cn(
                            "ml-auto text-[10px] px-1.5 py-0 h-4 animate-in fade-in-0 zoom-in-95 duration-300",
                            item.badgeVariant === "default" &&
                              "bg-primary/20 text-primary border-primary/30 animate-pulse"
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </a>
                  ) : (
                    <Link href={item.url} className="flex items-center w-full">
                      {item.icon && (
                        <item.icon
                          className={cn(
                            "size-4 text-muted-foreground transition-all group-hover:text-foreground group-hover:scale-110",
                            pathname === item.url && "text-foreground"
                          )}
                        />
                      )}
                      <span className="text-sm">{item.title}</span>
                      {item.badge && (
                        <Badge
                          variant={item.badgeVariant || "secondary"}
                          className={cn(
                            "ml-auto text-[10px] px-1.5 py-0 h-4 animate-in fade-in-0 zoom-in-95 duration-300",
                            item.badgeVariant === "default" &&
                              "bg-primary/20 text-primary border-primary/30 animate-pulse"
                          )}
                        >
                          {item.badge}
                        </Badge>
                      )}
                      {item.shortcut && (
                        <kbd className="hidden ml-auto px-1.5 py-0.5 text-[10px] text-muted-foreground bg-muted rounded border lg:inline-block">
                          ⌘{item.shortcut}
                        </kbd>
                      )}
                    </Link>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
