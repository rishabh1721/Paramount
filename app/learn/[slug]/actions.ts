"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function markLessonCompleteAction(
  enrollmentId: string,
  lessonId: string
) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { status: "error", message: "Unauthorized" };
    }

    await prisma.lessonProgress.upsert({
      where: {
        enrollmentId_lessonId: {
          enrollmentId,
          lessonId,
        },
      },
      create: {
        enrollmentId,
        lessonId,
        completed: true, // Changed from isCompleted
        lastWatchedAt: new Date(),
      },
      update: {
        completed: true, // Changed from isCompleted
        lastWatchedAt: new Date(),
      },
    });

    revalidatePath("/learn");
    return { status: "success", message: "Lesson marked as complete!" };
  } catch (error) {
    console.error("Error marking lesson complete:", error);
    return { status: "error", message: "Failed to mark lesson complete" };
  }
}

export async function updateProgressAction(
  enrollmentId: string,
  lessonId: string
) {
  try {
    await prisma.lessonProgress.upsert({
      where: {
        enrollmentId_lessonId: {
          enrollmentId,
          lessonId,
        },
      },
      create: {
        enrollmentId,
        lessonId,
        lastWatchedAt: new Date(),
      },
      update: {
        lastWatchedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("Error updating progress:", error);
  }
}
