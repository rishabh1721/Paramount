"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ChevronDown, 
  ChevronRight, 
  CheckCircle2, 
  PlayCircle, 
  Circle, 
  Clock,
  Award,
  TrendingUp,
  Sparkles,
  Loader2
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Lesson {
  id: string;
  title: string;
  duration: number;
  isCompleted: boolean;
  isPending?: boolean;
}

interface Chapter {
  id: string;
  title: string;
  position: number;
  lessons: Lesson[];
}

interface LessonsSidebarProps {
  chapters: Chapter[];
  currentLessonId: string;
  courseSlug: string;
}

export function LessonsSidebar({
  chapters,
  currentLessonId,
  courseSlug,
}: LessonsSidebarProps) {
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
    new Set(chapters.map((ch) => ch.id))
  );

  const toggleChapter = (chapterId: string) => {
    const newExpanded = new Set(expandedChapters);
    if (newExpanded.has(chapterId)) {
      newExpanded.delete(chapterId);
    } else {
      newExpanded.add(chapterId);
    }
    setExpandedChapters(newExpanded);
  };

  const totalLessons = chapters.reduce((acc, ch) => acc + ch.lessons.length, 0);
  const completedLessons = chapters.reduce(
    (acc, ch) => acc + ch.lessons.filter((l) => l.isCompleted).length,
    0
  );
  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const totalDuration = chapters.reduce(
    (acc, ch) => acc + ch.lessons.reduce((sum, l) => sum + l.duration, 0),
    0
  );

  return (
    <div className="w-96 border-r border-border/40 bg-gradient-to-b from-background via-background/98 to-background/95 backdrop-blur-xl flex flex-col h-full shadow-xl">
      {/* Premium Progress Header */}
      <div className="p-6 border-b border-border/40 bg-gradient-to-br from-background via-background/95 to-background backdrop-blur-2xl space-y-5">
        {/* Header Title */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 via-primary/10 to-primary/5 border border-primary/30 shadow-lg shadow-primary/10">
              <TrendingUp className="size-5 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-base bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Your Progress
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">Keep up the great work!</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 shadow-lg shadow-primary/10">
            <Sparkles className="size-4 text-primary animate-pulse" />
            <span className="text-sm font-bold text-primary">{progress}%</span>
          </div>
        </div>

        {/* Progress Bar with Glow Effect */}
        <div className="space-y-3">
          <div className="relative h-3 bg-muted/50 rounded-full overflow-hidden shadow-inner border border-border/30">
            {/* Animated Background Shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent animate-shimmer" />
            
            {/* Progress Fill with Gradient and Glow */}
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-primary to-primary/90 transition-all duration-700 ease-out rounded-full shadow-lg shadow-primary/50"
              style={{ width: `${progress}%` }}
            >
              {/* Inner Highlight */}
              <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/10 to-white/30 rounded-full" />
              {/* Pulse Effect */}
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-r from-transparent to-white/20 rounded-r-full animate-pulse" />
            </div>
          </div>

          {/* Stats Row */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-5">
              <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <div className="p-1 rounded-md bg-primary/10">
                  <CheckCircle2 className="size-4 text-primary" />
                </div>
                <span className="font-semibold">
                  {completedLessons} of {totalLessons} completed
                </span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
                <div className="p-1 rounded-md bg-muted">
                  <Clock className="size-4" />
                </div>
                <span className="font-semibold">
                  {Math.floor(totalDuration / 60)} min total
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Achievement Badge (shows when 100% complete) */}
        {progress === 100 && (
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-primary/15 via-primary/10 to-primary/5 border border-primary/30 animate-in slide-in-from-top-2 duration-500 shadow-lg shadow-primary/10">
            <div className="p-2 rounded-lg bg-primary/20">
              <Award className="size-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-primary">Course Completed!</p>
              <p className="text-xs text-primary/70 mt-0.5">Congratulations! 🎉</p>
            </div>
          </div>
        )}
      </div>

      {/* Lessons List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="p-4 space-y-4">
          {chapters.map((chapter, chapterIndex) => {
            const isExpanded = expandedChapters.has(chapter.id);
            const chapterCompleted = chapter.lessons.every((l) => l.isCompleted);
            const chapterProgress = chapter.lessons.filter((l) => l.isCompleted).length;

            return (
              <div 
                key={chapter.id} 
                className="space-y-2 animate-in fade-in-0 slide-in-from-left-4 duration-300"
                style={{ animationDelay: `${chapterIndex * 50}ms` }}
              >
                {/* Premium Chapter Header */}
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full justify-between px-4 py-4 h-auto rounded-xl transition-all duration-300 group border-2",
                    isExpanded 
                      ? "bg-accent/70 hover:bg-accent/90 border-primary/20 shadow-md" 
                      : "hover:bg-accent/50 border-transparent hover:border-border/50"
                  )}
                  onClick={() => toggleChapter(chapter.id)}
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {/* Animated Chevron */}
                    <div className={cn(
                      "p-1.5 rounded-lg bg-muted/50 group-hover:bg-muted transition-all duration-300",
                      isExpanded && "rotate-0 bg-primary/10"
                    )}>
                      {isExpanded ? (
                        <ChevronDown className="size-4 text-foreground transition-colors" />
                      ) : (
                        <ChevronRight className="size-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      )}
                    </div>

                    {/* Chapter Number Badge */}
                    <div className="shrink-0 flex items-center justify-center size-8 rounded-xl bg-gradient-to-br from-primary/30 via-primary/20 to-primary/10 border border-primary/30 group-hover:border-primary/50 group-hover:shadow-lg group-hover:shadow-primary/20 transition-all duration-300">
                      <span className="text-sm font-bold text-primary">{chapterIndex + 1}</span>
                    </div>

                    {/* Chapter Title */}
                    <div className="flex-1 min-w-0 text-left">
                      <p className="text-sm font-bold truncate group-hover:text-primary transition-colors">
                        {chapter.title}
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {chapter.lessons.length} lessons
                      </p>
                    </div>
                  </div>

                  {/* Chapter Stats */}
                  <div className="flex items-center gap-3 shrink-0">
                    {/* Progress Badge */}
                    <div className={cn(
                      "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-300 border",
                      chapterCompleted
                        ? "bg-primary/20 text-primary border-primary/40 shadow-md shadow-primary/10"
                        : "bg-muted/50 text-muted-foreground border-border/50"
                    )}>
                      <span>{chapterProgress}/{chapter.lessons.length}</span>
                    </div>

                    {/* Checkmark for completed chapters */}
                    {chapterCompleted && (
                      <div className="p-1.5 rounded-lg bg-primary/20 border border-primary/30 animate-in zoom-in-0 duration-300 shadow-md shadow-primary/10">
                        <CheckCircle2 className="size-4 text-primary" />
                      </div>
                    )}
                  </div>
                </Button>

                {/* Premium Lessons List */}
                {isExpanded && (
                  <div className="ml-6 space-y-2 border-l-2 border-primary/30 pl-4 animate-in slide-in-from-top-2 duration-300">
                    {chapter.lessons.map((lesson, lessonIndex) => {
                      const isActive = lesson.id === currentLessonId;

                      return (
                        <Link
                          key={lesson.id}
                          href={`/learn/${courseSlug}?lesson=${lesson.id}`}
                          className={cn(
                            "flex items-start gap-4 p-4 rounded-xl transition-all duration-300 group relative overflow-hidden border-2",
                            isActive
                              ? "bg-gradient-to-r from-primary/20 via-primary/15 to-primary/10 border-primary/50 shadow-lg shadow-primary/10"
                              : "hover:bg-accent/60 border-transparent hover:border-border/50 hover:shadow-md"
                          )}
                        >
                          {/* Active Indicator Line */}
                          {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-12 bg-gradient-to-b from-primary via-primary to-primary/50 rounded-r-full shadow-lg shadow-primary/50 animate-pulse" />
                          )}

                          {/* Lesson Status Icon */}
                          <div className="shrink-0 mt-1 relative">
                            {lesson.isCompleted ? (
                              <div className="relative">
                                <div className="absolute inset-0 bg-primary/30 rounded-full blur-lg animate-pulse" />
                                <div className="p-2 rounded-xl bg-primary/20 border border-primary/30 shadow-lg shadow-primary/20 relative">
                                  <CheckCircle2 className="size-5 text-primary" />
                                </div>
                              </div>
                            ) : lesson.isPending ? (
                              <div className="relative">
                                <div className="absolute inset-0 bg-orange-500/30 rounded-full blur-lg animate-pulse" />
                                <div className="p-2 rounded-xl bg-orange-500/20 border border-orange-500/30 shadow-lg shadow-orange-500/20 relative">
                                  <Loader2 className="size-5 text-orange-500 animate-spin" />
                                </div>
                              </div>
                            ) : isActive ? (
                              <div className="relative">
                                <div className="absolute inset-0 bg-primary/40 rounded-full blur-lg animate-pulse" />
                                <div className="p-2 rounded-xl bg-gradient-to-br from-primary/30 to-primary/20 border border-primary/40 shadow-lg shadow-primary/30 relative">
                                  <PlayCircle className="size-5 text-primary" />
                                </div>
                              </div>
                            ) : (
                              <div className="p-2 rounded-xl bg-muted/50 border border-border/50 group-hover:bg-muted group-hover:border-border transition-all">
                                <Circle className="size-5 text-muted-foreground" />
                              </div>
                            )}
                          </div>

                          {/* Lesson Details */}
                          <div className="flex-1 min-w-0 space-y-2">
                            <div className="space-y-1">
                              {/* Lesson Number & Title */}
                              <div className="flex items-start gap-2">
                                <span className="text-xs font-bold text-muted-foreground group-hover:text-foreground transition-colors shrink-0 mt-1">
                                  {lessonIndex + 1}.
                                </span>
                                
                                <p
                                  className={cn(
                                    "text-sm font-semibold leading-snug transition-colors pr-2",
                                    isActive 
                                      ? "text-primary" 
                                      : "text-foreground group-hover:text-primary"
                                  )}
                                >
                                  {lesson.title}
                                </p>
                              </div>

                              {/* Currently Watching Badge - Moved below title */}
                              {isActive && (
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/20 border border-primary/30 animate-in zoom-in-0 duration-300">
                                  <div className="size-1.5 rounded-full bg-primary animate-pulse" />
                                  <span className="text-[10px] font-bold text-primary uppercase tracking-wide">
                                    Now Playing
                                  </span>
                                </div>
                              )}

                              {/* Pending Badge */}
                              {lesson.isPending && (
                                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-orange-500/20 border border-orange-500/30">
                                  <Loader2 className="size-3 text-orange-500 animate-spin" />
                                  <span className="text-[10px] font-bold text-orange-500 uppercase tracking-wide">
                                    Processing
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Duration Badge */}
                            <div className="flex items-center gap-2">
                              <div className={cn(
                                "flex items-center gap-1.5 px-2.5 py-1 rounded-lg border transition-colors",
                                isActive 
                                  ? "bg-primary/10 border-primary/30 text-primary" 
                                  : "bg-muted/50 border-border/50 text-muted-foreground group-hover:bg-muted group-hover:border-border"
                              )}>
                                <Clock className="size-3" />
                                <span className="text-xs font-semibold">
                                  {Math.floor(lesson.duration / 60)} min
                                </span>
                              </div>

                              {/* Status Indicators */}
                              {lesson.isCompleted && (
                                <div className="px-2.5 py-1 rounded-lg bg-primary/10 border border-primary/20">
                                  <span className="text-[10px] font-bold text-primary uppercase tracking-wide">
                                    Completed
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Add custom scrollbar styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: hsl(var(--muted-foreground) / 0.3);
          border-radius: 100px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: hsl(var(--muted-foreground) / 0.5);
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </div>
  );
}
