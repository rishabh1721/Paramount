import "server-only";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  if (!session) {
    return redirect("/login");
  }

  // Allow both admin and instructor roles
  if (session.user.role !== "admin" && session.user.role !== "instructor") {
    return redirect("/not-admin");
  }

  return session;
}
