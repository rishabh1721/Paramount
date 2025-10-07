import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetCourses(page: number = 1, limit: number = 6) {
  const user = await requireAdmin();

  const skip = (page - 1) * limit;

  // Parallel queries for better performance
  const [courses, totalCount] = await Promise.all([
    prisma.course.findMany({
      where: {
        userId: user.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        smallDescription: true,
        duration: true,
        level: true,
        price: true,
        fileKey: true,
        slug: true,
      },
      skip,
      take: limit,
    }),
    prisma.course.count({
      where: {
        userId: user.user.id,
      },
    }),
  ]);

  return {
    courses,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      hasMore: skip + courses.length < totalCount,
    },
  };
}

export type AdminCourseType = Awaited<ReturnType<typeof adminGetCourses>>["courses"][0];
