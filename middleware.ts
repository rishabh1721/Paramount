import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

async function authMiddleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  // If no session cookie, redirect to login
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Only run middleware on protected routes
  matcher: ["/admin/:path*", "/dashboard/:path*", "/learn/:path*", "/my-courses/:path*"],
};

export default async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Apply auth middleware for protected routes
  if (
    pathname.startsWith("/admin") || 
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/learn") ||
    pathname.startsWith("/my-courses")
  ) {
    return authMiddleware(request);
  }

  return NextResponse.next();
}
