import { getCourseLearning } from "@/app/data/course/get-course-learning";
import { notFound, redirect } from "next/navigation";
import { VideoPlayer } from "./_components/VideoPlayer";
import { LessonsSidebar } from "./_components/LessonsSidebar";
import { CourseHeader } from "./_components/CourseHeader";
import { MobileLessonsSheet } from "./_components/MobileLessonsSheet";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ lesson?: string }>;
};

export default async function LearnPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { lesson: lessonId } = await searchParams;

  const courseData = await getCourseLearning(slug);

  if (!courseData) {
    notFound();
  }

  const firstLesson = courseData.chapters[0]?.lessons[0];
  if (!lessonId && firstLesson) {
    redirect(`/learn/${slug}?lesson=${firstLesson.id}`);
  }

  const currentLesson = courseData.chapters
    .flatMap((ch) => ch.lessons)
    .find((l) => l.id === lessonId);

  if (!currentLesson) {
    redirect(`/learn/${slug}?lesson=${firstLesson?.id}`);
  }

  return (
    <>
      {/* Desktop Layout */}
      <div className="hidden lg:flex min-h-screen flex-col bg-gradient-to-b from-background via-background/98 to-background/95 overflow-hidden">
        {/* Fixed Header */}
        <CourseHeader course={courseData.course} />

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar - Fixed width on desktop */}
          <aside className="w-[22rem] xl:w-[24rem] shrink-0">
            <LessonsSidebar
              chapters={courseData.chapters}
              currentLessonId={currentLesson.id}
              courseSlug={slug}
            />
          </aside>

          {/* Video Player */}
          <main className="flex-1 overflow-hidden">
            <VideoPlayer
              lesson={currentLesson}
              courseSlug={slug}
              enrollmentId={courseData.enrollmentId}
              allLessons={courseData.chapters.flatMap((ch) => ch.lessons)}
            />
          </main>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex lg:hidden min-h-screen flex-col bg-background">
        {/* Fixed Header */}
        <CourseHeader course={courseData.course} />

        {/* Video Player - Full width */}
        <main className="flex-1 overflow-auto pb-20">
          <VideoPlayer
            lesson={currentLesson}
            courseSlug={slug}
            enrollmentId={courseData.enrollmentId}
            allLessons={courseData.chapters.flatMap((ch) => ch.lessons)}
          />
        </main>

        {/* Mobile Lessons Sheet - Fixed bottom */}
        <MobileLessonsSheet
          chapters={courseData.chapters}
          currentLessonId={currentLesson.id}
          courseSlug={slug}
        />
      </div>
    </>
  );
}
