"use client";

import { useState } from "react";
import { BookOpen, ChevronUp, List } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { LessonsSidebar } from "./LessonsSidebar";

interface MobileLessonsSheetProps {
  chapters: any[];
  currentLessonId: string;
  courseSlug: string;
}

export function MobileLessonsSheet({
  chapters,
  currentLessonId,
  courseSlug,
}: MobileLessonsSheetProps) {
  const currentLesson = chapters
    .flatMap((ch) => ch.lessons)
    .find((l) => l.id === currentLessonId);

  const totalLessons = chapters.reduce((acc, ch) => acc + ch.lessons.length, 0);
  const currentIndex = chapters
    .flatMap((ch) => ch.lessons)
    .findIndex((l) => l.id === currentLessonId);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-xl border-t border-border/50 shadow-2xl">
      <Sheet>
        <SheetTrigger asChild>
          <button className="w-full p-4 flex items-center justify-between hover:bg-accent/50 transition-colors active:scale-[0.98]">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                <List className="size-4 text-primary" />
              </div>
              <div className="text-left flex-1 min-w-0">
                <p className="text-sm font-semibold line-clamp-1">
                  {currentLesson?.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  Lesson {currentIndex + 1} of {totalLessons}
                </p>
              </div>
            </div>
            <ChevronUp className="size-5 text-muted-foreground shrink-0" />
          </button>
        </SheetTrigger>

        <SheetContent side="bottom" className="h-[85vh] p-0 rounded-t-2xl">
          <div className="h-full overflow-y-auto">
            <LessonsSidebar
              chapters={chapters}
              currentLessonId={currentLessonId}
              courseSlug={courseSlug}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
