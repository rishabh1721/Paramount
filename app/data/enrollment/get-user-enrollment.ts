import { prisma } from "@/lib/db";
import { cache } from "react";

export const getUserEnrollments = cache(async (userId: string) => {
  const enrollments = await prisma.enrollment.findMany({
    where: {
      userId: userId,
      status: "Active",
    },
    include: {
      Course: {
        include: {
          user: {
            select: {
              name: true,
              image: true,
            },
          },
          chapters: {
            include: {
              lessons: true,
            },
            orderBy: {
              position: "asc",
            },
          },
        },
      },
      lessonProgress: {  // Back to lowercase
        include: {
          Lesson: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  // Calculate progress for each enrollment
  const enrollmentsWithProgress = enrollments.map((enrollment) => {
    const totalLessons = enrollment.Course.chapters.reduce(
      (sum, chapter) => sum + chapter.lessons.length,
      0
    );
    const completedLessons = enrollment.lessonProgress.filter(  // Back to lowercase
      (lp) => lp.completed
    ).length;
    const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

    return {
      ...enrollment,
      calculatedProgress: progress,
      totalLessons,
      completedLessons,
    };
  });

  return enrollmentsWithProgress;
});

export type EnrollmentWithProgress = Awaited<
  ReturnType<typeof getUserEnrollments>
>[0];
