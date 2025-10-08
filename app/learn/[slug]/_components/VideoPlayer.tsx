"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  Clock, 
  Play,
  SkipForward,
  SkipBack,
  Award,
  TrendingUp,
  Sparkles,
  BookmarkPlus,
  Share2,
  ThumbsUp,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { markLessonCompleteAction, updateProgressAction } from "../actions";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

interface Lesson {
  id: string;
  title: string;
  videoKey: string;
  duration: number;
  isCompleted: boolean;
}

interface VideoPlayerProps {
  lesson: Lesson;
  courseSlug: string;
  enrollmentId: string;
  allLessons: Lesson[];
}

export function VideoPlayer({
  lesson,
  courseSlug,
  enrollmentId,
  allLessons,
}: VideoPlayerProps) {
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(lesson.isCompleted);
  const [watchProgress, setWatchProgress] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const currentIndex = allLessons.findIndex((l) => l.id === lesson.id);
  const previousLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  // Format video URL - handle both S3 URLs and direct URLs
  const getVideoUrl = (videoKey: string) => {
    // If it's already a full URL (starts with http), use it directly
    if (videoKey.startsWith('http://') || videoKey.startsWith('https://')) {
      return videoKey;
    }
    // Otherwise, construct S3 URL
    return `https://paramount.t3.storage.dev/${videoKey}`;
  };

  useEffect(() => {
    setIsCompleted(lesson.isCompleted);
    setWatchProgress(0);
  }, [lesson.id, lesson.isCompleted]);

  // Track video progress
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const progress = (video.currentTime / video.duration) * 100;
      setWatchProgress(progress);
    };

    video.addEventListener("timeupdate", handleTimeUpdate);
    return () => video.removeEventListener("timeupdate", handleTimeUpdate);
  }, [lesson.id]);

  // Track progress every 5 seconds
  useEffect(() => {
    const interval = setInterval(async () => {
      if (videoRef.current && !videoRef.current.paused) {
        await updateProgressAction(enrollmentId, lesson.id);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [enrollmentId, lesson.id]);

  const handleMarkComplete = async () => {
    const result = await markLessonCompleteAction(enrollmentId, lesson.id);
    if (result.status === "success") {
      setIsCompleted(true);
      toast.success("🎉 Lesson completed!", {
        description: nextLesson ? "Moving to next lesson..." : "Great job!",
      });
      
      if (nextLesson) {
        setTimeout(() => {
          router.push(`/learn/${courseSlug}?lesson=${nextLesson.id}`);
        }, 1500);
      }
    }
  };

  const handleNavigation = (lessonId: string) => {
    router.push(`/learn/${courseSlug}?lesson=${lessonId}`);
  };

  const handleSkip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const videoUrl = getVideoUrl(lesson.videoKey);

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-background to-background/95">
      {/* Premium Video Container */}
      <div className="relative bg-gradient-to-b from-black via-black to-black/95 flex items-center justify-center group" 
        style={{ height: 'calc(100vh - 16rem)' }}>
        
        {/* Video Element */}
        <video
          ref={videoRef}
          key={lesson.id}
          controls
          className="w-full h-full object-contain"
          controlsList="nodownload"
          autoPlay
          playsInline
        >
          <source 
            src={videoUrl} 
            type="video/mp4" 
          />
          Your browser does not support the video tag.
        </video>

        {/* Custom Overlay Controls */}
        <div className="absolute inset-0 flex items-center justify-between px-8 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          {/* Skip Back 10s */}
          <Button
            variant="secondary"
            size="icon"
            className="pointer-events-auto size-14 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-xl border border-white/20 shadow-2xl transition-all hover:scale-110"
            onClick={() => handleSkip(-10)}
          >
            <SkipBack className="size-6 text-white" />
          </Button>

          {/* Skip Forward 10s */}
          <Button
            variant="secondary"
            size="icon"
            className="pointer-events-auto size-14 rounded-full bg-black/70 hover:bg-black/90 backdrop-blur-xl border border-white/20 shadow-2xl transition-all hover:scale-110"
            onClick={() => handleSkip(10)}
          >
            <SkipForward className="size-6 text-white" />
          </Button>
        </div>

        {/* Watch Progress Indicator */}
        {watchProgress > 0 && watchProgress < 100 && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/30 z-10">
            <div 
              className="h-full bg-gradient-to-r from-primary via-primary to-primary/80 transition-all duration-300 shadow-lg shadow-primary/50"
              style={{ width: `${watchProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* Premium Control Panel */}
      <div className="border-t border-border/50 bg-gradient-to-b from-background/98 to-background backdrop-blur-2xl">
        <div className="px-6 lg:px-8 py-6 space-y-6">
          
          {/* Top Section - Title and Status */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h2 className="text-2xl font-bold leading-tight mb-2 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  {lesson.title}
                </h2>
                
                {/* Meta Info Row */}
                <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20">
                      <Clock className="size-3.5 text-primary" />
                    </div>
                    <span className="font-medium">{Math.floor(lesson.duration / 60)} minutes</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-muted/50">
                      <TrendingUp className="size-3.5" />
                    </div>
                    <span className="font-medium">Lesson {currentIndex + 1} of {allLessons.length}</span>
                  </div>

                  {watchProgress > 0 && (
                    <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                      <Sparkles className="size-3 text-primary" />
                      <span className="text-xs font-semibold text-primary">
                        {Math.round(watchProgress)}% watched
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Badge */}
              {isCompleted && (
                <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/20 to-primary/10 border border-primary/30 rounded-xl shrink-0 shadow-lg shadow-primary/10 animate-in zoom-in-0 duration-500">
                  <div className="p-1 rounded-full bg-primary/20">
                    <CheckCircle2 className="size-4 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs font-bold text-primary">Completed</p>
                    <p className="text-[10px] text-primary/70">Well done!</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons Section */}
          <div className="flex items-center justify-between gap-4 flex-wrap">
            
            {/* Left - Navigation */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="default"
                onClick={() => previousLesson && handleNavigation(previousLesson.id)}
                disabled={!previousLesson}
                className="gap-2 hover:bg-accent/80 hover:border-primary/30 transition-all duration-200 rounded-xl group"
              >
                <ChevronLeft className="size-4 group-hover:-translate-x-0.5 transition-transform" />
                <span className="font-semibold">Previous</span>
              </Button>

              <Button
                variant="outline"
                size="default"
                onClick={() => nextLesson && handleNavigation(nextLesson.id)}
                disabled={!nextLesson}
                className="gap-2 hover:bg-accent/80 hover:border-primary/30 transition-all duration-200 rounded-xl group"
              >
                <span className="font-semibold">Next</span>
                <ChevronRight className="size-4 group-hover:translate-x-0.5 transition-transform" />
              </Button>
            </div>

            {/* Right - Actions */}
            <div className="flex items-center gap-2">
              
              {/* Like Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsLiked(!isLiked)}
                className={`rounded-xl hover:bg-accent/80 transition-all duration-200 ${
                  isLiked ? 'text-primary bg-primary/10' : ''
                }`}
              >
                <ThumbsUp className={`size-4 ${isLiked ? 'fill-primary' : ''}`} />
              </Button>

              {/* Save Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSaved(!isSaved)}
                className={`rounded-xl hover:bg-accent/80 transition-all duration-200 ${
                  isSaved ? 'text-primary bg-primary/10' : ''
                }`}
              >
                <BookmarkPlus className={`size-4 ${isSaved ? 'fill-primary' : ''}`} />
              </Button>

              {/* Share Button */}
              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl hover:bg-accent/80 transition-all duration-200"
              >
                <Share2 className="size-4" />
              </Button>

              {/* Mark Complete Button */}
              {!isCompleted && (
                <Button 
                  onClick={handleMarkComplete}
                  size="lg"
                  className="gap-2 shadow-xl shadow-primary/30 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 rounded-xl font-bold px-6 animate-in fade-in-0 slide-in-from-right-4 duration-500"
                >
                  <CheckCircle2 className="size-5" />
                  <span>Mark as Complete</span>
                </Button>
              )}

              {/* Next Lesson Button (when completed) */}
              {isCompleted && nextLesson && (
                <Button 
                  onClick={() => handleNavigation(nextLesson.id)}
                  size="lg"
                  className="gap-2 shadow-xl shadow-primary/30 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 rounded-xl font-bold px-6 group animate-in fade-in-0 slide-in-from-right-4 duration-500"
                >
                  <span>Continue Learning</span>
                  <ChevronRight className="size-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              )}
            </div>
          </div>

          {/* Progress Bar for Current Lesson */}
          {watchProgress > 0 && watchProgress < 100 && (
            <div className="space-y-2 animate-in fade-in-0 slide-in-from-bottom-2 duration-500">
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span className="font-medium">Watch Progress</span>
                <span className="font-semibold">{Math.round(watchProgress)}%</span>
              </div>
              <Progress value={watchProgress} className="h-2" />
            </div>
          )}

          {/* Achievement Notification (when completing) */}
          {isCompleted && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 animate-in slide-in-from-bottom-4 duration-500">
              <div className="p-2 rounded-full bg-primary/20 animate-bounce">
                <Award className="size-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-sm text-primary">Lesson Complete! 🎉</p>
                <p className="text-xs text-muted-foreground">
                  {nextLesson 
                    ? "Ready for the next challenge?" 
                    : "You've completed all lessons!"}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
