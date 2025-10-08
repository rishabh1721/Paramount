"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, PlayCircle, TrendingUp, Activity } from "lucide-react";
import { EnrollmentWithProgress } from "@/app/data/enrollment/get-user-enrollment";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface RecentActivityProps {
  enrollments: EnrollmentWithProgress[];
}

export function RecentActivity({ enrollments }: RecentActivityProps) {
  const recentActivities = enrollments
    .flatMap((enrollment) =>
      enrollment.lessonProgress
        .filter((lp) => lp.lastWatchedAt)
        .map((lp) => ({
          courseName: enrollment.Course.title,
          courseSlug: enrollment.Course.slug,
          lessonName: lp.Lesson.title,
          timestamp: lp.lastWatchedAt!,
        }))
    )
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
    .slice(0, 8);

  if (recentActivities.length === 0) {
    return (
      <Card className="border-border/50 hover:border-primary/30 transition-all duration-500 animate-in fade-in-0 slide-in-from-right-6">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
              <TrendingUp className="size-4 text-primary" />
            </div>
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <div className="relative mx-auto mb-4 inline-flex">
              <div className="absolute inset-0 animate-ping">
                <div className="size-16 rounded-xl bg-primary/10" />
              </div>
              <div className="relative size-16 rounded-xl bg-muted border border-border/50 flex items-center justify-center">
                <Clock className="size-7 text-muted-foreground" />
              </div>
            </div>
            <p className="text-sm font-medium text-muted-foreground mb-1">
              No recent activity yet
            </p>
            <p className="text-xs text-muted-foreground/70">
              Start learning to see your progress here
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-lg animate-in fade-in-0 slide-in-from-right-6">
      <CardHeader className="pb-4 space-y-2">
        <CardTitle className="flex items-center gap-3 text-lg">
          <div className="rounded-lg bg-primary/10 p-2 border border-primary/20 group-hover:scale-110 transition-transform">
            <TrendingUp className="size-5 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              Recent Activity
              <Activity className="size-4 text-primary animate-pulse" />
            </div>
          </div>
        </CardTitle>
        <p className="text-sm text-muted-foreground pl-11">
          Your latest learning sessions
        </p>
      </CardHeader>
      <CardContent className="space-y-1">
        {recentActivities.map((activity, index) => (
          <Link
            key={index}
            href={`/learn/${activity.courseSlug}`}
            className="group flex items-start gap-3 p-4 rounded-xl hover:bg-accent/50 border border-transparent hover:border-primary/20 transition-all duration-300 hover:-translate-x-1 animate-in fade-in-0 slide-in-from-right-4"
            style={{
              animationDelay: `${index * 50}ms`,
              animationFillMode: 'backwards'
            }}
          >
            <div className="relative">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-primary/20 rounded-xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0 group-hover:bg-primary/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <PlayCircle className="size-5 text-primary group-hover:animate-pulse" />
              </div>
            </div>

            <div className="flex-1 min-w-0 space-y-1">
              <p className="text-sm font-semibold truncate group-hover:text-primary transition-colors duration-300">
                {activity.lessonName}
              </p>
              <p className="text-xs text-muted-foreground truncate group-hover:text-foreground transition-colors duration-300">
                {activity.courseName}
              </p>
              <div className="flex items-center gap-1.5 pt-0.5">
                <Clock className="size-3.5 text-muted-foreground/60" />
                <p className="text-xs text-muted-foreground/70 group-hover:text-muted-foreground transition-colors">
                  {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
                </p>
              </div>
            </div>

            {/* Arrow indicator */}
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
              <div className="size-6 rounded-lg bg-primary/10 flex items-center justify-center">
                <svg 
                  className="size-3.5 text-primary" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
