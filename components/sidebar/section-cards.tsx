"use client";

import { IconTrendingDown, IconTrendingUp, IconUsers, IconBook, IconTarget  } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useState, useEffect } from "react";
import { authClient } from "@/lib/auth-client";
import { DollarSign } from "lucide-react";

interface StatsData {
  totalRevenue: number;
  revenueChange: number;
  totalStudents: number;
  studentsChange: number;
  activeCourses: number;
  coursesChange: number;
  completionRate: number;
  completionChange: number;
}

export function SectionCards() {
  const { data: session } = authClient.useSession();
  const [stats, setStats] = useState<StatsData>({
    totalRevenue: 0,
    revenueChange: 0,
    totalStudents: 0,
    studentsChange: 0,
    activeCourses: 0,
    coursesChange: 0,
    completionRate: 0,
    completionChange: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/dashboard-stats");
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error("Error fetching stats:", error);
        // Fallback to demo data
        setStats({
          totalRevenue: 12500,
          revenueChange: 12.5,
          totalStudents: 1234,
          studentsChange: -8.2,
          activeCourses: 24,
          coursesChange: 15.3,
          completionRate: 78.5,
          completionChange: 4.8,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
    // Refresh every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  };

  const getBadgeVariant = (change: number) => {
    if (change > 0) return "default";
    if (change < -10) return "destructive";
    return "secondary";
  };

  const getTrendIcon = (change: number) => {
    return change >= 0 ? IconTrendingUp : IconTrendingDown;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return "text-green-500";
    if (change < -10) return "text-red-500";
    return "text-orange-500";
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-24" />
              <div className="h-8 bg-muted rounded w-32" />
              <div className="h-6 bg-muted rounded w-16 ml-auto" />
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5">
              <div className="h-4 bg-muted rounded w-40" />
              <div className="h-3 bg-muted rounded w-32" />
            </CardFooter>
          </Card>
        ))}
      </div>
    );
  }

  const cards = [
    {
      title: "Total Revenue",
      value: formatCurrency(stats.totalRevenue),
      change: stats.revenueChange,
      description: "Monthly recurring revenue",
      subtext: "Revenue from all active courses",
      icon: DollarSign,
      link: "/admin/revenue",
      color: "from-green-500/10 to-green-500/5",
      iconColor: "text-green-500",
    },
    {
      title: "Active Students",
      value: formatNumber(stats.totalStudents),
      change: stats.studentsChange,
      description: "Enrolled students this month",
      subtext: stats.studentsChange < 0 ? "Acquisition needs attention" : "Growing student base",
      icon: IconUsers,
      link: "/admin/students",
      color: "from-blue-500/10 to-blue-500/5",
      iconColor: "text-blue-500",
    },
    {
      title: "Active Courses",
      value: formatNumber(stats.activeCourses),
      change: stats.coursesChange,
      description: "Published courses",
      subtext: "Strong course portfolio growth",
      icon: IconBook,
      link: "/admin/courses",
      color: "from-purple-500/10 to-purple-500/5",
      iconColor: "text-purple-500",
    },
    {
      title: "Completion Rate",
      value: `${stats.completionRate.toFixed(1)}%`,
      change: stats.completionChange,
      description: "Average course completion",
      subtext: "Excellent student engagement",
      icon: IconTarget,
      link: "/admin/analytics",
      color: "from-orange-500/10 to-orange-500/5",
      iconColor: "text-orange-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cards.map((card, index) => {
        const TrendIcon = getTrendIcon(card.change);
        const trendColor = getTrendColor(card.change);
        const badgeVariant = getBadgeVariant(card.change);

        return (
          <Card
            key={card.title}
            className={`@container/card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-gradient-to-br ${card.color} border-border/50 group cursor-pointer`}
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <CardHeader className="relative">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardDescription className="text-xs font-medium">
                    {card.title}
                  </CardDescription>
                  <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl group-hover:scale-105 transition-transform">
                    {card.value}
                  </CardTitle>
                </div>
                <div className={`p-2 rounded-lg bg-background/50 ${card.iconColor}`}>
                  <card.icon className="size-5" />
                </div>
              </div>
              <CardAction>
                <Badge
                  variant={badgeVariant}
                  className={`${
                    card.change >= 0
                      ? "bg-green-500/20 text-green-500 border-green-500/30"
                      : card.change < -10
                      ? "bg-red-500/20 text-red-500 border-red-500/30"
                      : "bg-orange-500/20 text-orange-500 border-orange-500/30"
                  } animate-in fade-in-0 zoom-in-95 duration-500`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <TrendIcon className="size-3 mr-1" />
                  {formatPercentage(card.change)}
                </Badge>
              </CardAction>
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm pt-0">
              <div className={`line-clamp-1 flex gap-2 font-medium ${trendColor}`}>
                {card.description} <TrendIcon className="size-4" />
              </div>
              <div className="text-muted-foreground text-xs">
                {card.subtext}
              </div>
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="mt-2 w-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Link href={card.link}>
                  View Details →
                </Link>
              </Button>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
