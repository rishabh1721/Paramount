import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getCourseLearning(slug: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return null;
  }

  const course = await prisma.course.findUnique({
    where: { slug },
    include: {
      chapters: {
        orderBy: { position: "asc" },
        include: {
          lessons: {
            orderBy: { position: "asc" },
          },
        },
      },
      enrollment: {
        where: {
          userId: session.user.id,
          status: "Active",
        },
        include: {
          lessonProgress: true,
        },
      },
    },
  });

  if (!course) {
    return null;
  }

  // Check if user is enrolled
  const enrollment = course.enrollment[0];
  if (!enrollment) {
    return null;
  }

  return {
    course: {
      id: course.id,
      title: course.title,
      slug: course.slug,
      smallDescription: course.smallDescription,
    },
    chapters: course.chapters.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      position: chapter.position,
      lessons: chapter.lessons.map((lesson) => {
        const progress = enrollment.lessonProgress.find(
          (lp) => lp.lessonId === lesson.id
        );
        return {
          id: lesson.id,
          title: lesson.title,
          position: lesson.position,
          duration: lesson.duration,
          videoKey: lesson.videoKey ?? "",
          thumbnailKey: lesson.thumbnailKey,
          isCompleted: progress?.completed ?? false,
          lastWatchedAt: progress?.lastWatchedAt,
        };
      }),
    })),
    enrollmentId: enrollment.id,
  };
}

export type CourseLearningType = NonNullable<
  Awaited<ReturnType<typeof getCourseLearning>>
>;
