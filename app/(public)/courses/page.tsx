import { getAllCourses } from "@/app/data/course/get-all-courses";
import { Suspense } from "react";
import { PublicCourseCard } from "../_components/PublicCourseCard";
import { CoursesGridSkeleton } from "../_components/CoursesGridSkeleton";
import { PublicCoursesPagination } from "../_components/PublicCoursesPagination";

type PageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function PublicCoursesRoute({ searchParams }: PageProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col space-y-2 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tighter">
          Explore Courses
        </h1>
        <p className="text-muted-foreground">
          Discover our wide range of courses designed to help you achieve your learning goals.
        </p>
      </div>

      {/* Courses with Suspense for streaming */}
      <Suspense 
        key={`courses-${JSON.stringify(await searchParams)}`}
        fallback={<CoursesGridSkeleton />}
      >
        <RenderCourses searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function RenderCourses({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  
  const { courses, pagination } = await getAllCourses(page, 12);

  // Empty state - first page with no courses
  if (courses.length === 0 && page === 1) {
    return (
      <div className="text-center py-20">
        <h3 className="text-2xl font-semibold mb-2">No courses available yet</h3>
        <p className="text-muted-foreground">Check back soon for new courses!</p>
      </div>
    );
  }

  // Out of range - invalid page number
  if (courses.length === 0 && page > 1) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-semibold mb-2">Page not found</h3>
        <p className="text-muted-foreground">This page doesn't have any courses.</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Courses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <PublicCourseCard key={course.id} course={course} />
        ))}
      </div>

      {/* Pagination */}
      <PublicCoursesPagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalCount={pagination.totalCount}
      />
    </div>
  );
}
