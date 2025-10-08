"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { BookOpen, PlayCircle, CheckCircle2 } from "lucide-react";
import { CourseDetailType } from "@/app/data/course/get-all-courses";
import { RichTextViewer } from "@/components/rich-text-editor/Viewer"; // ✅ Import

interface CourseContentProps {
  course: NonNullable<CourseDetailType>;
}

export function CourseContent({ course }: CourseContentProps) {
  const totalLessons = course.chapters.reduce((acc, chapter) => acc + chapter.lessons.length, 0);

  return (
    <Tabs defaultValue="overview" className="space-y-6">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
        <TabsTrigger value="instructor">Instructor</TabsTrigger>
      </TabsList>

      {/* Overview Tab */}
      <TabsContent value="overview" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>About This Course</CardTitle>
          </CardHeader>
          <CardContent>
            {/* ✅ Use RichTextViewer */}
            <RichTextViewer content={course.description} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What You'll Learn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                "Master the fundamentals",
                "Build real-world projects",
                "Best practices and patterns",
                "Advanced techniques",
                "Industry standards",
                "Career opportunities",
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="size-5 text-green-500 shrink-0 mt-0.5" />
                  <span className="text-sm">{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Curriculum Tab */}
      <TabsContent value="curriculum" className="space-y-4">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Course Curriculum</CardTitle>
              <Badge variant="secondary">
                {course.chapters.length} Chapters • {totalLessons} Lessons
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {course.chapters.map((chapter, idx) => (
              <Card key={chapter.id} className="border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center size-10 rounded-xl bg-primary/10 border border-primary/20">
                        <span className="font-bold text-primary">{idx + 1}</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">{chapter.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          {chapter.lessons.length} lessons
                        </p>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {chapter.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <PlayCircle className="size-5 text-primary shrink-0" />
                        <div className="flex-1">
                          <p className="font-medium">{lesson.title}</p>
                          {lesson.description && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {lesson.description}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </TabsContent>

      {/* Instructor Tab */}
      <TabsContent value="instructor">
        <Card>
          <CardHeader>
            <CardTitle>About the Instructor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-4">
              {course.user.image ? (
                <img
                  src={course.user.image}
                  alt={course.user.name}
                  className="size-20 rounded-full object-cover border-2 border-primary/20"
                />
              ) : (
                <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                  <span className="text-2xl font-bold text-primary">
                    {course.user.name.charAt(0)}
                  </span>
                </div>
              )}
              <div className="space-y-2">
                <h3 className="text-xl font-bold">{course.user.name}</h3>
                <p className="text-muted-foreground">{course.user.email}</p>
                <p className="text-sm text-muted-foreground">
                  Experienced instructor with years of teaching experience
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
