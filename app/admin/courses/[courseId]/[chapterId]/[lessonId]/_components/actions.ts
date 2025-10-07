"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

const aj = arcjet
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    })
  )
  .withRule(
    fixedWindow({
      mode: "LIVE",
      window: "1m",
      max: 5,
    })
  );

export async function updateLesson(
  lessonId: string,
  courseId: string,
  chapterId: string,
  data: {
    title: string;
    description?: string;
    thumbnailKey?: string;
    videoKey?: string;
  }
): Promise<ApiResponse> {
  const user = await requireAdmin();

  try {
    const req = await request();

    const decision = await aj.protect(req, {
      fingerprint: user.user.id,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "You have been blocked due to rate limiting",
        };
      } else {
        return {
          status: "error",
          message: "You are a bot! If this is a mistake contact our support",
        };
      }
    }

    // Verify course ownership
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
        userId: user.user.id,
      },
    });

    if (!course) {
      return {
        status: "error",
        message: "Course not found or unauthorized",
      };
    }

    // Verify chapter exists
    const chapter = await prisma.chapter.findUnique({
      where: {
        id: chapterId,
        courseId: courseId,
      },
    });

    if (!chapter) {
      return {
        status: "error",
        message: "Chapter not found",
      };
    }

    // Verify lesson exists
    const lesson = await prisma.lesson.findUnique({
      where: {
        id: lessonId,
        chapterId: chapterId,
      },
    });

    if (!lesson) {
      return {
        status: "error",
        message: "Lesson not found",
      };
    }

    console.log('💾 Updating lesson:', {
      lessonId,
      title: data.title,
      hasDescription: !!data.description,
      hasVideo: !!data.videoKey,
      hasThumbnail: !!data.thumbnailKey,
      videoKey: data.videoKey?.substring(0, 50),
      thumbnailKey: data.thumbnailKey?.substring(0, 50),
    });

    // Update the lesson
    const updatedLesson = await prisma.lesson.update({
      where: {
        id: lessonId,
      },
      data: {
        title: data.title,
        description: data.description || null,
        thumbnailKey: data.thumbnailKey || null,
        videoKey: data.videoKey || null,
      },
    });

    console.log('✅ Lesson updated successfully:', {
      id: updatedLesson.id,
      hasVideo: !!updatedLesson.videoKey,
      hasThumbnail: !!updatedLesson.thumbnailKey,
      videoKey: updatedLesson.videoKey?.substring(0, 50),
      thumbnailKey: updatedLesson.thumbnailKey?.substring(0, 50),
    });

    revalidatePath(`/admin/courses/${courseId}/edit`);
    revalidatePath(`/admin/courses/${courseId}/${chapterId}/${lessonId}`);

    return {
      status: "success",
      message: "Lesson updated successfully",
    };
  } catch (error) {
    console.error('❌ Failed to update lesson:', error);
    return {
      status: "error",
      message: "Failed to update lesson",
    };
  }
}
