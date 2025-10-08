import arcjet, { createMiddleware, detectBot } from "@arcjet/next";
import { env } from "./lib/env";
import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

const aj = arcjet({
  key: env.ARCJET_KEY!,
  rules: [
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE",
        "CATEGORY:MONITOR",
        "CATEGORY:PREVIEW",
      ],
    }),
  ],
});

async function authMiddleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  // THIS IS NOT SECURE!
  // This is the recommended approach to optimistically redirect users
  // We recommend handling auth checks in each page/route
  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Exclude webhook and auth routes from middleware
  matcher: [
    "/((?!payment/webhooks|api/auth|_next/static|_next/image|favicon.ico).*)"
  ],
};

// Pass any existing middleware with the optional existingMiddleware prop
export default createMiddleware(aj, async (request) => {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for payment webhook routes
  if (pathname.startsWith("/payment/webhooks")) {
    return NextResponse.next();
  }

  // Skip middleware for auth routes (they don't need bot detection)
  if (pathname.startsWith("/api/auth")) {
    return NextResponse.next();
  }

  // Apply auth middleware only for admin routes
  if (pathname.startsWith("/admin")) {
    return authMiddleware(request);
  }

  return NextResponse.next();
});
