import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ApplicationStatus } from "@/lib/generated/prisma"; // ✅ Correct import path
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Check authentication
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is admin
    if (session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden - Admin access required" },
        { status: 403 }
      );
    }

    // Count pending applications
    const count = await prisma.instructorApplication.count({
      where: {
        status: ApplicationStatus.Pending, // ✅ Using the enum
      },
    });

    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error fetching applications count:", error);
    return NextResponse.json(
      { error: "Internal server error", count: 0 },
      { status: 500 }
    );
  }
}
