"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function approveApplicationAction(
  applicationId: string,
  userId: string
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id || session.user.role !== "admin") {
      return { status: "error", message: "Unauthorized" };
    }

    // Update application status
    await prisma.instructorApplication.update({
      where: { id: applicationId },
      data: {
        status: "Approved",
        reviewedAt: new Date(),
        reviewedBy: session.user.id,
      },
    });

    // Update user role to instructor
    await prisma.user.update({
      where: { id: userId },
      data: {
        role: "instructor",
      },
    });

    revalidatePath("/admin/applications");
    return {
      status: "success",
      message: "Application approved! User is now an instructor.",
    };
  } catch (error) {
    console.error("Error approving application:", error);
    return { status: "error", message: "Failed to approve application" };
  }
}

export async function rejectApplicationAction(applicationId: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id || session.user.role !== "admin") {
      return { status: "error", message: "Unauthorized" };
    }

    await prisma.instructorApplication.update({
      where: { id: applicationId },
      data: {
        status: "Rejected",
        reviewedAt: new Date(),
        reviewedBy: session.user.id,
      },
    });

    revalidatePath("/admin/applications");
    return {
      status: "success",
      message: "Application rejected",
    };
  } catch (error) {
    console.error("Error rejecting application:", error);
    return { status: "error", message: "Failed to reject application" };
  }
}
