"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { chapterSchema, chapterSchemaType, courseSchema, CourseSchemaType, lessonSchema, lessonSchemaType } from "@/lib/zodSchemas";
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

export async function editCourse(
  data: CourseSchemaType,
  courseId: string
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

    const result = courseSchema.safeParse(data);
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    await prisma.course.update({
      where: {
        id: courseId,
        userId: user.user.id,
      },
      data: {
        ...result.data,
      },
    });

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Course updated successfully",
    };
  } catch (error) {
    console.error("Failed to update course:", error);
    return {
      status: "error",
      message: "Failed to update course",
    };
  }
}

export async function createChapter(
  data: chapterSchemaType
): Promise<ApiResponse<{ id: string; createdAt: Date; updatedAt: Date; title: string; position: number; courseId: string }>> {
  const user = await requireAdmin();

  try {
    const result = chapterSchema.safeParse(data);
    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    // Verify course ownership
    const course = await prisma.course.findUnique({
      where: {
        id: result.data.courseId,
        userId: user.user.id,
      },
    });

    if (!course) {
      return {
        status: "error",
        message: "Course not found or unauthorized",
      };
    }

    // Get the current highest position to add new chapter at the end
    const lastChapter = await prisma.chapter.findFirst({
      where: {
        courseId: result.data.courseId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newPosition = lastChapter ? lastChapter.position + 1 : 1;

    // Create the chapter
    const newChapter = await prisma.chapter.create({
      data: {
        title: result.data.name,
        courseId: result.data.courseId,
        position: newPosition,
      },
    });

    revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

    return {
      status: "success",
      message: "Chapter created successfully",
      data: newChapter,
    };
  } catch (error) {
    console.error("Failed to create chapter:", error);
    return {
      status: "error",
      message: "Failed to create chapter",
    };
  }
}

export async function reorderChapters(
  chapters: { id: string; position: number }[],
  courseId: string
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

    if (!chapters || chapters.length === 0) {
      return {
        status: "error",
        message: "No chapters provided for reordering.",
      };
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

    // Update all chapters sequentially (Neon doesn't support transactions on free tier)
    for (const chapter of chapters) {
      await prisma.chapter.update({
        where: {
          id: chapter.id,
          courseId: courseId,
        },
        data: {
          position: chapter.position,
        },
      });
    }

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Chapters reordered successfully",
    };
  } catch (error) {
    console.error("Failed to reorder chapters:", error);
    return {
      status: "error",
      message: "Failed to reorder chapters.",
    };
  }
}

export async function reorderLessons(
  chapterId: string,
  lessons: { id: string; position: number }[],
  courseId: string
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

    if (!lessons || lessons.length === 0) {
      return {
        status: "error",
        message: "No lessons provided for reordering.",
      };
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

    // Verify chapter exists and belongs to the course
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

    // Update all lessons sequentially (Neon doesn't support transactions on free tier)
    for (const lesson of lessons) {
      await prisma.lesson.update({
        where: {
          id: lesson.id,
          chapterId: chapterId,
        },
        data: {
          position: lesson.position,
        },
      });
    }

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Lessons reordered successfully",
    };
  } catch (error) {
    console.error("Failed to reorder lessons:", error);
    return {
      status: "error",
      message: "Failed to reorder lessons.",
    };
  }
}

export async function createLesson(
  data: lessonSchemaType
): Promise<ApiResponse<{ id: string; createdAt: Date; updatedAt: Date; title: string; position: number; chapterId: string }>> {
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

    const result = lessonSchema.safeParse(data);
    if (!result.success) {
      console.error("Lesson validation failed:", result.error);
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    // Verify course ownership
    const course = await prisma.course.findUnique({
      where: {
        id: result.data.courseId,
        userId: user.user.id,
      },
    });

    if (!course) {
      return {
        status: "error",
        message: "Course not found or unauthorized",
      };
    }

    // Verify chapter exists and belongs to the course
    const chapter = await prisma.chapter.findUnique({
      where: {
        id: result.data.chapterId,
        courseId: result.data.courseId,
      },
    });

    if (!chapter) {
      return {
        status: "error",
        message: "Chapter not found",
      };
    }

    // Get the current highest position to add new lesson at the end
    const lastLesson = await prisma.lesson.findFirst({
      where: {
        chapterId: result.data.chapterId,
      },
      orderBy: {
        position: "desc",
      },
    });

    const newPosition = lastLesson ? lastLesson.position + 1 : 1;

    // Create the lesson
    const newLesson = await prisma.lesson.create({
      data: {
        title: result.data.name,
        chapterId: result.data.chapterId,
        position: newPosition,
        description: result.data.description || null,
        thumbnailKey: result.data.thumbnailKey || null,
        videoKey: result.data.videoKey || null,
      },
    });

    revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

    return {
      status: "success",
      message: "Lesson created successfully",
      data: newLesson,
    };
  } catch (error) {
    console.error("Failed to create lesson:", error);
    return {
      status: "error",
      message: "Failed to create lesson",
    };
  }
}

export async function deleteLesson(
  lessonId: string,
  courseId: string,
  chapterId: string
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

    // Verify chapter exists and belongs to the course
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

    // Verify lesson exists and belongs to the chapter
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

    // Delete the lesson
    await prisma.lesson.delete({
      where: {
        id: lessonId,
      },
    });

    // Reorder remaining lessons
    const remainingLessons = await prisma.lesson.findMany({
      where: {
        chapterId: chapterId,
      },
      orderBy: {
        position: "asc",
      },
    });

    // Update positions to fill the gap sequentially
    for (let i = 0; i < remainingLessons.length; i++) {
      await prisma.lesson.update({
        where: { id: remainingLessons[i].id },
        data: { position: i + 1 },
      });
    }

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Lesson deleted successfully",
    };
  } catch (error) {
    console.error("Failed to delete lesson:", error);
    return {
      status: "error",
      message: "Failed to delete lesson",
    };
  }
}

export async function deleteChapter(
  chapterId: string,
  courseId: string
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

    // Verify chapter exists and belongs to the course
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

    // Delete the chapter (cascade will delete lessons)
    await prisma.chapter.delete({
      where: {
        id: chapterId,
      },
    });

    // Reorder remaining chapters
    const remainingChapters = await prisma.chapter.findMany({
      where: {
        courseId: courseId,
      },
      orderBy: {
        position: "asc",
      },
    });

    // Update positions to fill the gap sequentially
    for (let i = 0; i < remainingChapters.length; i++) {
      await prisma.chapter.update({
        where: { id: remainingChapters[i].id },
        data: { position: i + 1 },
      });
    }

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Chapter deleted successfully",
    };
  } catch (error) {
    console.error("Failed to delete chapter:", error);
    return {
      status: "error",
      message: "Failed to delete chapter",
    };
  }
}

export async function deleteCourse(courseId: string): Promise<ApiResponse> {
  console.log('🔍 DELETE COURSE CALLED:', { courseId });

  try {
    const user = await requireAdmin();
    console.log('✅ User authenticated:', user.user.id);

    const req = await request();

    const decision = await aj.protect(req, {
      fingerprint: user.user.id,
    });

    if (decision.isDenied()) {
      console.log('❌ Arcjet blocked request');
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

    console.log('✅ Arcjet protection passed');

    // Verify course ownership
    const course = await prisma.course.findUnique({
      where: {
        id: courseId,
        userId: user.user.id,
      },
    });

    console.log('📚 Course found:', course ? course.title : 'NOT FOUND');

    if (!course) {
      console.log('❌ Course not found or unauthorized');
      return {
        status: "error",
        message: "Course not found or unauthorized",
      };
    }

    console.log('🗑️ Attempting to delete course:', {
      courseId,
      title: course.title,
    });

    // Delete the course (cascade will delete chapters and lessons automatically)
    await prisma.course.delete({
      where: {
        id: courseId,
      },
    });

    console.log('✅ Course deleted successfully from database:', courseId);

    revalidatePath('/admin/courses');
    console.log('✅ Cache revalidated');

    return {
      status: "success",
      message: "Course deleted successfully",
    };
  } catch (error) {
    console.error('❌ FULL ERROR DETAILS:', {
      error,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    });
    
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Failed to delete course",
    };
  }
}
