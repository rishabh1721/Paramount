import { adminGetCourses } from "@/app/data/admin/admin-get-courses";
import { buttonVariants } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { AdminCourseCard } from "./_components/AdminCourseCard";
import { EmptyState } from "@/components/general/EmptyState";
import { Suspense } from "react";
import { CoursesGridSkeleton } from "./_components/CourseCardSkeleton";
import { CoursesPagination } from "./_components/CoursesPagination";

type PageProps = {
  searchParams: Promise<{ page?: string }>;
};

export default async function CoursesPage({ searchParams }: PageProps) {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Courses</h1>
          <p className="text-muted-foreground mt-1">
            Manage and organize your course content
          </p>
        </div>

        <Link 
          className={buttonVariants({ size: "lg" })} 
          href="/admin/courses/create"
        >
          <PlusIcon className="mr-2 size-4" />
          Create Course
        </Link>
      </div>

      {/* Content with Streaming and Suspense */}
      <Suspense fallback={<CoursesGridSkeleton />}>
        <CoursesContent searchParams={searchParams} />
      </Suspense>
    </div>
  );
}

async function CoursesContent({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  
  // Fetch courses with pagination
  const { courses, pagination } = await adminGetCourses(page, 6);

  // Show empty state only on first page with no courses
  if (courses.length === 0 && page === 1) {
    return <EmptyState />;
  }

  // Show message if page is out of range
  if (courses.length === 0 && page > 1) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No courses found on this page.</p>
        <Link 
          href="/admin/courses" 
          className={buttonVariants({ variant: "outline", className: "mt-4" })}
        >
          Go to first page
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Courses Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {courses.map((course) => (
          <AdminCourseCard key={course.id} data={course} />
        ))}
      </div>

      {/* Pagination */}
      <CoursesPagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        totalCount={pagination.totalCount}
      />
    </div>
  );
}
