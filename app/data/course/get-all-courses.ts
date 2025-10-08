import { prisma } from "@/lib/db";

// Get all published courses with pagination
export async function getAllCourses(page: number = 1, limit: number = 12) {
  const skip = (page - 1) * limit;

  // Parallel queries for better performance
  const [data, totalCount] = await Promise.all([
    prisma.course.findMany({
      where: {
        status: "Published",
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        smallDescription: true,
        description: true,
        fileKey: true,
        price: true,
        duration: true,
        level: true,
        category: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            chapters: true,
          },
        },
      },
    }),
    prisma.course.count({
      where: {
        status: "Published",
      },
    }),
  ]);

  return {
    courses: data,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
      hasMore: skip + data.length < totalCount,
      limit,
    },
  };
}

// Get single course by slug with full details
export async function getCourseBySlug(slug: string) {
  const course = await prisma.course.findUnique({
    where: {
      slug,
      status: "Published",
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
        },
      },
      chapters: {
        orderBy: {
          position: 'asc',
        },
        include: {
          lessons: {
            orderBy: {
              position: 'asc',
            },
            select: {
              id: true,
              title: true,
              description: true,
              thumbnailKey: true,
              position: true,
            },
          },
        },
      },
    },
  });

  return course;
}

// Get featured/latest courses for homepage
export async function getFeaturedCourses(limit: number = 6) {
  const courses = await prisma.course.findMany({
    where: {
      status: "Published",
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
    select: {
      id: true,
      title: true,
      slug: true,
      smallDescription: true,
      fileKey: true,
      price: true,
      duration: true,
      level: true,
      category: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      _count: {
        select: {
          chapters: true,
        },
      },
    },
  });

  return courses;
}

// Get courses by category
export async function getCoursesByCategory(category: string, limit: number = 8) {
  const courses = await prisma.course.findMany({
    where: {
      category,
      status: "Published",
    },
    orderBy: {
      createdAt: 'desc',
    },
    take: limit,
    select: {
      id: true,
      title: true,
      slug: true,
      smallDescription: true,
      fileKey: true,
      price: true,
      duration: true,
      level: true,
      category: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      _count: {
        select: {
          chapters: true,
        },
      },
    },
  });

  return courses;
}

// Get all unique categories with course count
export async function getCourseCategories() {
  const categories = await prisma.course.groupBy({
    by: ['category'],
    where: {
      status: "Published",
    },
    _count: {
      category: true,
    },
    orderBy: {
      _count: {
        category: 'desc',
      },
    },
  });

  return categories.map(cat => ({
    name: cat.category,
    count: cat._count.category,
  }));
}

// Search courses
export async function searchCourses(query: string, page: number = 1, limit: number = 12) {
  const skip = (page - 1) * limit;

  const [courses, totalCount] = await Promise.all([
    prisma.course.findMany({
      where: {
        status: "Published",
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { smallDescription: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { category: { contains: query, mode: 'insensitive' } },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
      select: {
        id: true,
        title: true,
        slug: true,
        smallDescription: true,
        fileKey: true,
        price: true,
        duration: true,
        level: true,
        category: true,
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        _count: {
          select: {
            chapters: true,
          },
        },
      },
    }),
    prisma.course.count({
      where: {
        status: "Published",
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { smallDescription: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { category: { contains: query, mode: 'insensitive' } },
        ],
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
      limit,
    },
  };
}

// Type exports
export type PublicCourseType = Awaited<ReturnType<typeof getAllCourses>>["courses"][0];
export type CourseDetailType = Awaited<ReturnType<typeof getCourseBySlug>>;
export type FeaturedCourseType = Awaited<ReturnType<typeof getFeaturedCourses>>[0];
export type CategoryType = Awaited<ReturnType<typeof getCourseCategories>>[0];
