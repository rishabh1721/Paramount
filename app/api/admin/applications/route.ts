import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ courses: 0, students: 0, revenue: 0 });
    }

    const [courses, enrollments, revenue] = await Promise.all([
      prisma.course.count({
        where: { userId: session.user.id },
      }),
      prisma.enrollment.count({
        where: {
          Course: { userId: session.user.id },
          status: "Active",
        },
      }),
      prisma.enrollment.aggregate({
        where: {
          Course: { userId: session.user.id },
          status: "Active",
        },
        _sum: { amount: true },
      }),
    ]);

    return NextResponse.json({
      courses,
      students: enrollments,
      revenue: Math.round((revenue._sum.amount || 0) / 1000), // in thousands
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    return NextResponse.json({ courses: 0, students: 0, revenue: 0 });
  }
}
