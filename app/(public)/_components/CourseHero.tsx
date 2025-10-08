"use client";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen, BarChart, Users } from "lucide-react";
import { CourseDetailType } from "@/app/data/course/get-all-courses";
import { useConstructUrl } from "@/hooks/use-construct-url";

interface CourseHeroProps {
  course: NonNullable<CourseDetailType>;
}

export function CourseHero({ course }: CourseHeroProps) {
  const thumbnailUrl = useConstructUrl(course.fileKey);

  return (
    <div className="relative bg-gradient-to-br from-background via-muted/30 to-background border-b">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Course Info */}
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary" className="text-sm px-3 py-1">
                {course.category}
              </Badge>
              <Badge variant="outline" className="text-sm px-3 py-1">
                {course.level}
              </Badge>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              {course.title}
            </h1>

            {/* Description */}
            <p className="text-lg text-muted-foreground leading-relaxed">
              {course.smallDescription}
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center size-10 rounded-xl bg-primary/10 border border-primary/20">
                  <Clock className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Duration</p>
                  <p className="font-bold">{course.duration}h</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center size-10 rounded-xl bg-primary/10 border border-primary/20">
                  <BookOpen className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Chapters</p>
                  <p className="font-bold">{course.chapters.length}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center size-10 rounded-xl bg-primary/10 border border-primary/20">
                  <BarChart className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Level</p>
                  <p className="font-bold">{course.level}</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center justify-center size-10 rounded-xl bg-primary/10 border border-primary/20">
                  <Users className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Students</p>
                  <p className="font-bold">1.2k</p>
                </div>
              </div>
            </div>

            {/* Instructor */}
            <div className="flex items-center gap-3 pt-4 border-t">
              {course.user.image ? (
                <img
                  src={course.user.image}
                  alt={course.user.name}
                  className="size-12 rounded-full object-cover border-2 border-primary/20"
                />
              ) : (
                <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center border-2 border-primary/20">
                  <span className="font-bold text-primary">
                    {course.user.name.charAt(0)}
                  </span>
                </div>
              )}
              <div>
                <p className="text-sm text-muted-foreground">Instructor</p>
                <p className="font-bold">{course.user.name}</p>
              </div>
            </div>
          </div>

          {/* Right - Course Image */}
          <div className="relative">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 border-border">
              {thumbnailUrl ? (
                <img
                  src={thumbnailUrl}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-muted flex items-center justify-center">
                  <BookOpen className="size-24 text-muted-foreground/30" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
