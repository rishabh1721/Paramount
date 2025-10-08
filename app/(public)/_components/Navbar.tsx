"use client";

import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import Link from "next/link";
import UserDropdown from "./userDropdown";
import { Menu, X, Award, LayoutDashboard } from "lucide-react";
import { useState } from "react";

const navigationItems = [
  {
    name: 'Home',
    href: '/',
  },
  {
    name: 'Courses',
    href: '/courses',
  },
  {
    name: 'Dashboard',
    href: '/dashboard',
  },
];

export function Navbar() {
  const { data: session, isPending } = authClient.useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check user role
  const isInstructor = session?.user?.role === "instructor" || session?.user?.role === "admin";
  const isStudent = session && !isInstructor;

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex min-h-16 items-center justify-between mx-auto px-4 md:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/logo123.PNG" alt="logo" width={40} height={40} className="size-9" />
          <span className="font-bold">Paramount</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:flex-1 md:items-center md:justify-between md:ml-8">
          <div className="flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            
            {isPending ? null : session ? (
              <>
                {/* Instructor Dashboard Button */}
                {isInstructor && (
                  <Link 
                    href="/admin" 
                    className={buttonVariants({ 
                      variant: "default",
                      size: "sm",
                      className: "gap-2"
                    })}
                  >
                    <LayoutDashboard className="size-4" />
                    <span className="hidden lg:inline">Instructor</span>
                  </Link>
                )}

                {/* Become Instructor Button */}
                {isStudent && (
                  <Link 
                    href="/become-instructor" 
                    className={buttonVariants({ 
                      variant: "outline",
                      size: "sm",
                      className: "gap-2 border-primary/30 hover:bg-primary/10"
                    })}
                  >
                    <Award className="size-4" />
                    <span className="hidden lg:inline">Teach</span>
                  </Link>
                )}

                {/* User Dropdown */}
                <UserDropdown
                  email={session.user.email}
                  image={session?.user.image ?? `https://avatar.vercel.sh/${session?.user.email}`}
                  name={
                    session?.user.name && session.user.name.length > 0
                      ? session.user.name.charAt(0).toUpperCase()
                      : session?.user.email.split("@")[0]
                  }
                />
              </>
            ) : (
              <>
                <Link href="/login" className={buttonVariants({ variant: "ghost", size: "sm" })}>
                  Login
                </Link>
                <Link href="/login" className={buttonVariants({ size: "sm" })}>
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container mx-auto px-4 py-4 flex flex-col space-y-4">
            {/* Navigation Links */}
            {navigationItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium transition-colors hover:text-primary py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Divider */}
            <div className="border-t my-2" />
            
            {/* Auth Buttons */}
            {isPending ? null : session ? (
              <div className="space-y-3">
                {/* Instructor Dashboard Button - Mobile */}
                {isInstructor && (
                  <Link 
                    href="/admin" 
                    className={buttonVariants({ 
                      variant: "default",
                      className: "w-full gap-2"
                    })}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <LayoutDashboard className="size-4" />
                    Instructor Dashboard
                  </Link>
                )}

                {/* Become Instructor Button - Mobile */}
                {isStudent && (
                  <Link 
                    href="/become-instructor" 
                    className={buttonVariants({ 
                      variant: "outline",
                      className: "w-full gap-2 border-primary/30"
                    })}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Award className="size-4" />
                    Become an Instructor
                  </Link>
                )}

                {/* User Info */}
                <div className="flex items-center gap-3 py-2">
                  <UserDropdown
                    email={session.user.email}
                    image={session?.user.image ?? `https://avatar.vercel.sh/${session?.user.email}`}
                    name={
                      session?.user.name && session.user.name.length > 0
                        ? session.user.name.charAt(0).toUpperCase()
                        : session?.user.email.split("@")[0]
                    }
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col space-y-2">
                <Link
                  href="/login"
                  className={buttonVariants({ variant: "ghost" })}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  href="/login"
                  className={buttonVariants()}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Get Started
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
