"use client";

import { Play, Clock, Award, BookOpen, CheckCircle2, ChevronRight, Sparkles } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { EnrollmentWithProgress } from "@/app/data/enrollment/get-user-enrollment";

interface CourseProgressCardProps {
  enrollment: EnrollmentWithProgress;
}

export function CourseProgressCard({ enrollment }: CourseProgressCardProps) {
  const { Course, calculatedProgress, completedLessons, totalLessons } = enrollment;
  const isCompleted = calculatedProgress === 100;
  const isStarted = calculatedProgress > 0;

  // Format image URL - handle both S3 URLs and direct URLs
  const getImageUrl = (fileKey: string) => {
    // If it's already a full URL (starts with http), use it directly
    if (fileKey.startsWith('http://') || fileKey.startsWith('https://')) {
      return fileKey;
    }
    // Otherwise, construct S3 URL
    return `https://paramount.t3.storage.dev/${fileKey}`;
  };

  const imageUrl = getImageUrl(Course.fileKey);

  return (
    <Card className="group overflow-hidden border-border/50 hover:border-primary/50 transition-all duration-500 hover:shadow-xl hover:-translate-y-2 animate-in fade-in-0 slide-in-from-bottom-6">
      {/* Thumbnail */}
      <div className="relative h-56 w-full overflow-hidden bg-muted">
        <Image
          src={imageUrl}
          alt={Course.title}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
          priority={false}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={(e) => {
            // Fallback to placeholder if image fails to load
            const target = e.currentTarget as HTMLImageElement;
            target.src = `https://placehold.co/800x450/1f2937/white?text=${encodeURIComponent(Course.title)}`;
          }}
        />
        
        {/* Overlay with enhanced gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
        
        {/* Hover glow effect */}
        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4 z-10">
          {isCompleted ? (
            <Badge className="bg-primary text-primary-foreground border-0 shadow-lg backdrop-blur-sm animate-in zoom-in-50 duration-300">
              <Award className="size-3.5 mr-1.5" />
              Completed
            </Badge>
          ) : isStarted ? (
            <Badge variant="secondary" className="border-0 shadow-lg backdrop-blur-sm">
              <Play className="size-3.5 mr-1.5" />
              In Progress
            </Badge>
          ) : (
            <Badge variant="outline" className="backdrop-blur-sm bg-background/50 shadow-lg">
              Not Started
            </Badge>
          )}
        </div>

        {/* Progress Indicator on Image */}
        {isStarted && !isCompleted && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background/95 to-transparent backdrop-blur-sm">
            <div className="flex items-center justify-between text-xs font-medium mb-2">
              <span className="text-foreground">{calculatedProgress}% Complete</span>
              <span className="text-muted-foreground">{completedLessons}/{totalLessons} lessons</span>
            </div>
            <div className="relative h-2 bg-background/40 rounded-full overflow-hidden border border-border/30">
              <div 
                className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-1000 ease-out shadow-lg shadow-primary/30"
                style={{ width: `${calculatedProgress}%` }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
              </div>
            </div>
          </div>
        )}

        {/* Completion Check */}
        {isCompleted && (
          <div className="absolute bottom-4 left-4 flex items-center gap-2 text-primary backdrop-blur-sm bg-primary/10 px-3 py-1.5 rounded-full border border-primary/20 animate-in zoom-in-50 duration-300">
            <CheckCircle2 className="size-4" />
            <span className="text-sm font-medium">Completed</span>
            <Sparkles className="size-3.5 animate-pulse" />
          </div>
        )}
      </div>

      <CardContent className="p-6 space-y-4">
        {/* Course Title */}
        <div className="space-y-2">
          <h3 className="font-bold text-xl line-clamp-2 group-hover:text-primary transition-colors duration-300 leading-tight">
            {Course.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {Course.smallDescription}
          </p>
        </div>

        {/* Course Meta */}
        <div className="flex items-center gap-4 flex-wrap pt-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            <div className="rounded-lg bg-primary/10 p-1.5 group-hover:bg-primary/20 transition-colors">
              <Clock className="size-3.5 text-primary" />
            </div>
            <span className="font-medium">{Math.floor(Course.duration / 60)}h</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
            <div className="rounded-lg bg-primary/10 p-1.5 group-hover:bg-primary/20 transition-colors">
              <BookOpen className="size-3.5 text-primary" />
            </div>
            <span className="font-medium">{completedLessons}/{totalLessons}</span>
          </div>
          <Badge variant="outline" className="ml-auto text-xs font-medium px-3 py-1">
            {Course.level}
          </Badge>
        </div>

        {/* Detailed Progress */}
        {!isCompleted && isStarted && (
          <div className="space-y-3 pt-4 border-t border-border/50">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Your Progress
              </span>
              <span className="text-sm font-bold text-primary">{calculatedProgress}%</span>
            </div>
            <div className="relative h-2 bg-muted/50 rounded-full overflow-hidden border border-border/30">
              <div 
                className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-1000 ease-out shadow-lg shadow-primary/20"
                style={{ width: `${calculatedProgress}%` }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer" />
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter className="p-6 pt-0">
        <Button 
          asChild 
          className="w-full group/btn relative overflow-hidden" 
          variant={isCompleted ? "outline" : "default"}
          size="lg"
        >
          <Link href={`/learn/${Course.slug}`} className="flex items-center justify-center gap-2">
            {/* Button glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/10 to-primary/0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
            
            {isCompleted ? (
              <>
                <Award className="size-4 group-hover/btn:rotate-12 transition-transform duration-300" />
                <span className="font-semibold">Review Course</span>
              </>
            ) : isStarted ? (
              <>
                <Play className="size-4 group-hover/btn:scale-110 transition-transform duration-300" />
                <span className="font-semibold">Continue Learning</span>
              </>
            ) : (
              <>
                <BookOpen className="size-4 group-hover/btn:scale-110 transition-transform duration-300" />
                <span className="font-semibold">Start Course</span>
              </>
            )}
            <ChevronRight className="size-4 transition-transform group-hover/btn:translate-x-1 duration-300" />
          </Link>
        </Button>
      </CardFooter>

      {/* Add shimmer animation style */}
      <style jsx>{`
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
      `}</style>
    </Card>
  );
}
