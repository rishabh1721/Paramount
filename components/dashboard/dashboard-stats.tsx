"use client";

import { BookOpen, Trophy, Clock, TrendingUp, Target, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DashboardStatsProps {
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalHours: number;
}

export function DashboardStats({
  totalCourses,
  completedCourses,
  inProgressCourses,
  totalHours,
}: DashboardStatsProps) {
  const completionRate = totalCourses > 0 
    ? Math.round((completedCourses / totalCourses) * 100) 
    : 0;

  const stats = [
    {
      title: "Total Enrolled",
      value: totalCourses,
      icon: BookOpen,
      description: "Active courses",
    },
    {
      title: "Completed",
      value: completedCourses,
      icon: Trophy,
      description: "Finished courses",
    },
    {
      title: "In Progress",
      value: inProgressCourses,
      icon: TrendingUp,
      description: "Currently learning",
    },
    {
      title: "Learning Hours",
      value: totalHours,
      icon: Clock,
      description: "Total content",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={stat.title} 
              className="group relative overflow-hidden border-border/50 hover:border-primary/50 hover:shadow-lg transition-all duration-500 hover:-translate-y-1 animate-in fade-in-0 slide-in-from-bottom-4"
              style={{
                animationDelay: `${index * 100}ms`,
                animationFillMode: 'backwards'
              }}
            >
              {/* Hover gradient effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <CardContent className="relative p-8">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-3 flex-1">
                    <p className="text-sm font-medium text-muted-foreground tracking-wide uppercase">
                      {stat.title}
                    </p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-5xl font-bold text-foreground tracking-tight transition-all duration-300 group-hover:text-primary">
                        {stat.value}
                      </p>
                      {stat.title === "Learning Hours" && (
                        <span className="text-lg text-muted-foreground">hrs</span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground/80">
                      {stat.description}
                    </p>
                  </div>
                  <div className="rounded-xl bg-primary/10 p-4 border border-primary/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 group-hover:bg-primary/20">
                    <Icon className="size-6 text-primary group-hover:animate-pulse" strokeWidth={2} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Completion Progress Bar */}
      {totalCourses > 0 && (
        <Card 
          className="border-border/50 hover:border-primary/30 transition-all duration-500 hover:shadow-md overflow-hidden group animate-in fade-in-0 slide-in-from-bottom-4"
          style={{
            animationDelay: '400ms',
            animationFillMode: 'backwards'
          }}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          
          <CardContent className="relative p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-6">
              <div className="flex items-start gap-4">
                <div className="rounded-xl bg-primary/10 p-3 border border-primary/20 group-hover:scale-110 transition-transform duration-500">
                  <Target className="size-6 text-primary" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">Overall Progress</h3>
                    {completionRate === 100 && (
                      <Sparkles className="size-4 text-primary animate-pulse" />
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {completedCourses} of {totalCourses} courses completed
                  </p>
                </div>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-4xl font-bold text-primary tracking-tight mb-1">
                  {completionRate}%
                </p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">
                  Completion Rate
                </p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="relative h-3 bg-muted/50 rounded-full overflow-hidden border border-border/30">
                <div
                  className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-1000 ease-out shadow-lg shadow-primary/20 relative overflow-hidden"
                  style={{ 
                    width: `${completionRate}%`,
                  }}
                >
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                </div>
              </div>
              
              {/* Milestone markers */}
              <div className="flex justify-between text-xs text-muted-foreground/60">
                <span>0%</span>
                <span>25%</span>
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
