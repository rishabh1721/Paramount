import { adminGetCourse } from "@/app/data/admin/admin-get-course";
import { DeleteCourseForm } from "./DeleteCourseForm";

type Params = Promise<{ courseId: string }>;

export default async function DeleteCourseRoute({ params }: { params: Params }) {
  const { courseId } = await params;
  const course = await adminGetCourse(courseId);

  return (
    <div className="max-w-2xl mx-auto w-full py-12 px-4">
      <DeleteCourseForm course={course} courseId={courseId} />
    </div>
  );
}
