"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Settings, Sparkles, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CourseHeaderProps {
  course: {
    title: string;
    slug: string;
  };
}

export function CourseHeader({ course }: CourseHeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);

  return (
    <header 
      className="border-b bg-gradient-to-r from-background via-background/98 to-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50 transition-all duration-300"
      style={{
        boxShadow: isScrolled ? '0 4px 6px -1px rgb(0 0 0 / 0.1)' : 'none'
      }}
    >
      <div className="flex h-16 items-center justify-between px-6 lg:px-8">
        {/* Left Section */}
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Back Button with Hover Effect */}
          <Button 
            variant="ghost" 
            size="icon" 
            asChild 
            className="shrink-0 hover:bg-accent/80 hover:scale-105 transition-all duration-200 rounded-xl group"
          >
            <Link href="/dashboard">
              <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
            </Link>
          </Button>

          {/* Course Title Section */}
          <div className="flex items-center gap-3 min-w-0 group">
            {/* Animated Icon */}
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-primary/20 rounded-lg blur-lg group-hover:blur-xl transition-all" />
              <div className="relative bg-gradient-to-br from-primary/10 to-primary/5 p-2 rounded-lg border border-primary/20 group-hover:border-primary/40 transition-all">
                <BookOpen className="size-4 text-primary" />
              </div>
            </div>

            {/* Course Title with Gradient */}
            <div className="min-w-0">
              <h1 className="font-bold text-base truncate bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                {course.title}
              </h1>
              <p className="text-xs text-muted-foreground flex items-center gap-1">
                <Sparkles className="size-3" />
                <span>Learning Mode</span>
              </p>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          {/* Course Details Button */}
          <Button 
            variant="outline" 
            size="sm" 
            asChild
            className="hidden md:flex gap-2 hover:bg-accent/80 hover:border-primary/30 transition-all duration-200 rounded-lg"
          >
            <Link href={`/courses/${course.slug}`}>
              <BookOpen className="size-3.5" />
              <span className="text-xs font-medium">Course Details</span>
            </Link>
          </Button>

          {/* Settings/Menu Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="icon"
                className="hover:bg-accent/80 hover:scale-105 transition-all duration-200 rounded-xl"
              >
                <Settings className="size-4 hover:rotate-45 transition-transform duration-300" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href={`/courses/${course.slug}`} className="cursor-pointer">
                  <BookOpen className="size-4 mr-2" />
                  View Course Details
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard" className="cursor-pointer">
                  <ArrowLeft className="size-4 mr-2" />
                  Back to Dashboard
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="cursor-pointer">
                <Settings className="size-4 mr-2" />
                Video Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Animated Progress Line */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
    </header>
  );
}
