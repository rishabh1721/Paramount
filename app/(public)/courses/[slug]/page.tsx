import { getCourseBySlug } from "@/app/data/course/get-all-courses";
import { notFound } from "next/navigation";
import { CourseHero } from "../../_components/CourseHero";
import { CourseContent } from "../../_components/CourseContent";
import { CourseSidebar } from "../../_components/CourseSidebar";
import { checkUserEnrollment } from "@/app/data/enrollment/check-enrollment";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function SlugPage({ params }: PageProps) {
  const { slug } = await params;
  const course = await getCourseBySlug(slug);

  if (!course) {
    notFound();
  }

  // Check if user is enrolled
  const isEnrolled = await checkUserEnrollment(course.id);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <CourseHero course={course} />

      {/* Main Content Area */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Course Content */}
          <div className="lg:col-span-2">
            <CourseContent course={course} />
          </div>

          {/* Right - Sidebar */}
          <div className="lg:col-span-1">
            <CourseSidebar course={course} isEnrolled={isEnrolled} />
          </div>
        </div>
      </div>
    </div>
  );
}
