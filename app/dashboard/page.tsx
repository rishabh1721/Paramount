import { requireUser } from "@/app/data/user/require-user";
import { getUserEnrollments } from "@/app/data/enrollment/get-user-enrollment";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { CourseProgressCard } from "@/components/dashboard/course-progress-card";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { Button } from "@/components/ui/button";
import { Sparkles, Rocket } from "lucide-react";
import Link from "next/link";

export default async function DashboardPage() {
  const user = await requireUser();
  const enrollments = await getUserEnrollments(user.id);

  const completedCourses = enrollments.filter(
    (e) => e.calculatedProgress === 100
  ).length;
  const inProgressCourses = enrollments.filter(
    (e) => e.calculatedProgress > 0 && e.calculatedProgress < 100
  ).length;
  const totalHours = enrollments.reduce(
    (sum, e) => sum + e.Course.duration,
    0
  );

  const continueWatching = enrollments
    .filter((e) => e.calculatedProgress > 0 && e.calculatedProgress < 100)
    .slice(0, 3);

  return (
    <div className="min-h-screen pb-20">
      <div className="container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
        {/* Header */}
        <div className="flex flex-col gap-6 animate-in fade-in-0 slide-in-from-top-4 duration-500">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold tracking-tight">
                Welcome back, {user.name}
              </h1>
              <Sparkles className="size-6 text-primary animate-pulse" />
            </div>
            <p className="text-muted-foreground text-lg">
              Continue your learning journey and achieve your goals
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
          <DashboardStats
            totalCourses={enrollments.length}
            completedCourses={completedCourses}
            inProgressCourses={inProgressCourses}
            totalHours={totalHours}
          />
        </div>

        {enrollments.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-24 px-4 text-center animate-in fade-in-0 zoom-in-95 duration-500">
            <div className="relative mb-8">
              <div className="absolute inset-0 animate-ping opacity-20">
                <div className="size-24 rounded-2xl bg-primary/30" />
              </div>
              <div className="absolute inset-0 animate-pulse opacity-30">
                <div className="size-24 rounded-2xl bg-primary/20 blur-xl" />
              </div>
              <div className="relative size-24 rounded-2xl bg-muted border-2 border-border/50 flex items-center justify-center shadow-lg">
                <Rocket className="size-12 text-muted-foreground" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold mb-3">Start Your Learning Journey</h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl leading-relaxed">
              Explore our collection of courses and begin mastering new skills today. Your next achievement is just a click away!
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Continue Watching */}
            {continueWatching.length > 0 && (
              <div className="space-y-6 animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h2 className="text-2xl font-bold tracking-tight">Continue Watching</h2>
                    <p className="text-sm text-muted-foreground">
                      Pick up where you left off
                    </p>
                  </div>
                  <Button asChild variant="ghost" size="sm" className="self-start sm:self-auto">
                    <Link href="/my-courses">View All →</Link>
                  </Button>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {continueWatching.map((enrollment) => (
                    <CourseProgressCard
                      key={enrollment.id}
                      enrollment={enrollment}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Main Content Grid */}
            <div className="grid gap-8 lg:grid-cols-12 animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-150">
              {/* All Courses */}
              <div className="lg:col-span-8 space-y-6">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold tracking-tight">My Courses</h2>
                  <p className="text-sm text-muted-foreground">
                    All your enrolled courses in one place
                  </p>
                </div>
                <div className="grid gap-6 md:grid-cols-2">
                  {enrollments.map((enrollment) => (
                    <CourseProgressCard
                      key={enrollment.id}
                      enrollment={enrollment}
                    />
                  ))}
                </div>
              </div>

              {/* Sidebar - Recent Activity */}
              <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-6">
                  <RecentActivity enrollments={enrollments} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
