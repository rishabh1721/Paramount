import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth"; // or your auth method
import { headers } from "next/headers";

export async function checkUserEnrollment(courseId: string): Promise<boolean> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return false;
    }

    const enrollment = await prisma.enrollment.findFirst({
      where: {
        userId: session.user.id,
        courseId: courseId,
        status: "Active",
      },
    });

    return !!enrollment;
  } catch (error) {
    console.error("Error checking enrollment:", error);
    return false;
  }
}
