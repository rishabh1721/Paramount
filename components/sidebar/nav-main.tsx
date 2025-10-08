"use client";

import { ChevronRight, type Icon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function NavMain({
  items,
}: {
  items: {
    title: string;
    url: string;
    icon?: any;
    isActive?: boolean;
    badge?: number | string;
    badgeVariant?: "default" | "secondary" | "outline" | "destructive";
    description?: string;
    items?: {
      title: string;
      url: string;
      icon?: any;
    }[];
  }[];
}) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-1">
        <SidebarMenu>
          {items.map((item) =>
            item.items && item.items.length > 0 ? (
              // Collapsible menu item with sub-items
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className="group hover:bg-accent/80 transition-all duration-200"
                    >
                      {item.icon && (
                        <item.icon className="size-4 transition-transform group-hover:scale-110" />
                      )}
                      <span className="font-medium">{item.title}</span>
                      {item.badge && (
                        <Badge
                          variant={item.badgeVariant || "secondary"}
                          className="ml-auto size-5 rounded-full p-0 flex items-center justify-center text-[10px]"
                        >
                          {item.badge}
                        </Badge>
                      )}
                      <ChevronRight className="ml-auto size-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton
                            asChild
                            className={cn(
                              "hover:bg-accent/60 transition-all duration-200",
                              pathname === subItem.url &&
                                "bg-accent text-primary font-medium"
                            )}
                          >
                            <Link href={subItem.url}>
                              {subItem.icon && (
                                <subItem.icon className="size-3.5" />
                              )}
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ) : (
              // Regular menu item without sub-items
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.description || item.title}  // ✅ Only pass string
                  className={cn(
                    "group hover:bg-accent/80 transition-all duration-200 relative",
                    pathname === item.url &&
                      "bg-primary/10 text-primary font-semibold hover:bg-primary/15 border-l-2 border-primary"
                  )}
                >
                  <Link href={item.url} className="flex items-center w-full">
                    {item.icon && (
                      <item.icon
                        className={cn(
                          "size-4 transition-transform group-hover:scale-110",
                          pathname === item.url && "text-primary"
                        )}
                      />
                    )}
                    <span>{item.title}</span>
                    {item.badge && (
                      <Badge
                        variant={item.badgeVariant || "secondary"}
                        className={cn(
                          "ml-auto text-[10px] px-1.5 py-0 h-5 animate-in fade-in-0 zoom-in-95 duration-300",
                          item.badgeVariant === "default" &&
                            "bg-primary/20 text-primary border-primary/30 animate-pulse"
                        )}
                      >
                        {item.badge}
                      </Badge>
                    )}
                    {pathname === item.url && (
                      <div className="absolute inset-y-0 left-0 w-1 bg-primary rounded-r-full" />
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
