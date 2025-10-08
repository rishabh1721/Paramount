import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, BookOpen, Activity, ArrowUpRight, ArrowDownRight, Clock, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function AdminDashboard() {
  const session = await requireAdmin();
  const user = session.user;
  const isAdmin = user.role === "admin";

  // Get current month stats
  const now = new Date();
  const firstDayThisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstDayLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const lastDayLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

  // Fetch only what exists in your database
  const [
    totalRevenue,
    lastMonthRevenue,
    allEnrollments,
    lastMonthEnrollmentsData,
    totalCourses,
    publishedCourses,
    activeEnrollments,
    pendingApplications,
    recentCourses,
  ] = await Promise.all([
    // Total revenue this month
    prisma.enrollment.aggregate({
      where: {
        Course: { userId: user.id },
        status: "Active",
        createdAt: { gte: firstDayThisMonth },
      },
      _sum: { amount: true },
    }),
    // Last month revenue
    prisma.enrollment.aggregate({
      where: {
        Course: { userId: user.id },
        status: "Active",
        createdAt: {
          gte: firstDayLastMonth,
          lte: lastDayLastMonth,
        },
      },
      _sum: { amount: true },
    }),
    // All enrollments
    prisma.enrollment.findMany({
      where: {
        Course: { userId: user.id },
        status: "Active",
      },
      select: { userId: true },
    }),
    // Last month enrollments
    prisma.enrollment.findMany({
      where: {
        Course: { userId: user.id },
        status: "Active",
        createdAt: {
          gte: firstDayLastMonth,
          lte: lastDayLastMonth,
        },
      },
      select: { userId: true },
    }),
    // Total courses
    prisma.course.count({
      where: { userId: user.id },
    }),
    // Published courses
    prisma.course.count({
      where: { 
        userId: user.id,
        status: "Published",
      },
    }),
    // Active enrollments count
    prisma.enrollment.count({
      where: {
        Course: { userId: user.id },
        status: "Active",
      },
    }),
    // Pending applications (admin only)
    isAdmin
      ? prisma.instructorApplication.count({
          where: { status: "Pending" },
        })
      : 0,
    // Recent courses
    prisma.course.findMany({
      where: { userId: user.id },
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        title: true,
        status: true,
        createdAt: true,
        _count: {
          select: { enrollment: true },
        },
      },
    }),
  ]);

  // Calculate unique students
  const uniqueStudentIds = new Set(allEnrollments.map((e) => e.userId));
  const totalStudents = uniqueStudentIds.size;
  const uniqueLastMonthIds = new Set(lastMonthEnrollmentsData.map((e) => e.userId));
  const lastMonthStudents = uniqueLastMonthIds.size;

  // Calculate percentages
  const revenue = totalRevenue._sum.amount || 0;
  const lastRevenue = lastMonthRevenue._sum.amount || 1;
  const revenueChange = ((revenue - lastRevenue) / lastRevenue) * 100;
  const studentsChange = lastMonthStudents > 0 ? ((totalStudents - lastMonthStudents) / lastMonthStudents) * 100 : 0;

  return (
    <div className="flex flex-col gap-6 md:gap-8 pb-8 animate-in fade-in-0 slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/20 p-6 md:p-8 shadow-xl">
        <div className="absolute inset-0 bg-grid-white/10 [mask-image:radial-gradient(white,transparent_85%)]" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                Welcome back, {user.name}! 👋
              </h1>
              {(isAdmin || user.role === "instructor") && (
                <Badge className="bg-primary/20 text-primary border-primary/30 px-3 py-1">
                  <Sparkles className="size-3 mr-1" />
                  {isAdmin ? "Admin" : "Instructor"}
                </Badge>
              )}
            </div>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl">
              Here's what's happening with your courses today
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            <Button asChild size="lg" className="gap-2 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90">
              <Link href="/admin/courses">
                <BookOpen className="size-4" />
                My Courses
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards - Only Real Data */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <Card className="hover:shadow-lg transition-all duration-300 border-border/50 bg-gradient-to-br from-green-500/5 to-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-medium">Total Revenue</CardDescription>
              <div className="p-2 rounded-lg bg-green-500/10">
                <DollarSign className="size-4 text-green-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${revenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {revenueChange >= 0 ? (
                <>
                  <ArrowUpRight className="size-3 text-green-500 mr-1" />
                  <span className="text-green-500">+{Math.abs(revenueChange).toFixed(1)}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="size-3 text-red-500 mr-1" />
                  <span className="text-red-500">{revenueChange.toFixed(1)}%</span>
                </>
              )}
              <span className="ml-1">from last month</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {revenue > 0 ? "Monthly revenue" : "No revenue yet"}
            </p>
          </CardContent>
        </Card>

        {/* Total Students */}
        <Card className="hover:shadow-lg transition-all duration-300 border-border/50 bg-gradient-to-br from-blue-500/5 to-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-medium">Total Students</CardDescription>
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Users className="size-4 text-blue-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudents.toLocaleString()}</div>
            <div className="flex items-center text-xs text-muted-foreground mt-1">
              {studentsChange >= 0 ? (
                <>
                  <ArrowUpRight className="size-3 text-green-500 mr-1" />
                  <span className="text-green-500">+{Math.abs(studentsChange).toFixed(1)}%</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="size-3 text-red-500 mr-1" />
                  <span className="text-red-500">{studentsChange.toFixed(1)}%</span>
                </>
              )}
              <span className="ml-1">from last month</span>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {totalStudents > 0 ? "Unique students" : "No students yet"}
            </p>
          </CardContent>
        </Card>

        {/* Total Enrollments */}
        <Card className="hover:shadow-lg transition-all duration-300 border-border/50 bg-gradient-to-br from-purple-500/5 to-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-medium">Enrollments</CardDescription>
              <div className="p-2 rounded-lg bg-purple-500/10">
                <Activity className="size-4 text-purple-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeEnrollments.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {totalCourses > 0 ? `${(activeEnrollments / totalCourses).toFixed(1)} avg per course` : "No courses yet"}
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {activeEnrollments > 0 ? "Active enrollments" : "No enrollments yet"}
            </p>
          </CardContent>
        </Card>

        {/* Total Courses */}
        <Card className="hover:shadow-lg transition-all duration-300 border-border/50 bg-gradient-to-br from-orange-500/5 to-card">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardDescription className="text-xs font-medium">My Courses</CardDescription>
              <div className="p-2 rounded-lg bg-orange-500/10">
                <BookOpen className="size-4 text-orange-500" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCourses}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {publishedCourses} published
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              {totalCourses > 0 ? "Total courses created" : "Create your first course"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:gap-8 lg:grid-cols-3">
        {/* Recent Courses (Takes 2 columns) */}
        <div className="lg:col-span-2">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Clock className="size-5" />
                    Recent Courses
                  </CardTitle>
                  <CardDescription className="mt-1">Your latest courses</CardDescription>
                </div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/admin/courses">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentCourses.length > 0 ? (
                  recentCourses.map((course) => (
                    <Link
                      key={course.id}
                      href={`/admin/courses/${course.id}`}
                      className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-all duration-200 group"
                    >
                      <div className="size-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                        <BookOpen className="size-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-1 group-hover:text-primary transition-colors">
                          {course.title}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            variant="outline"
                            className={`text-[10px] px-1.5 py-0 ${
                              course.status === "Published"
                                ? "bg-green-500/10 text-green-500 border-green-500/20"
                                : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                            }`}
                          >
                            {course.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {course._count.enrollment} students
                          </span>
                        </div>
                      </div>
                      <ArrowUpRight className="size-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </Link>
                  ))
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <BookOpen className="size-12 mx-auto mb-4 opacity-20" />
                    <p className="text-sm font-medium">No courses yet</p>
                    <p className="text-xs mt-1">Create your first course to get started!</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar (Takes 1 column) */}
        <div className="space-y-6">
          {/* Admin Actions - Only if pending applications exist */}
          {isAdmin && pendingApplications > 0 && (
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20 shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Activity className="size-5 text-primary" />
                  Action Required
                </CardTitle>
                <CardDescription>
                  {pendingApplications} pending application{pendingApplications > 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full shadow-md">
                  <Link href="/admin/applications">
                    Review Now
                    <ArrowUpRight className="size-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button asChild variant="outline" size="sm" className="w-full justify-start gap-2">
                <Link href="/admin/courses">
                  <BookOpen className="size-4" />
                  View All Courses
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full justify-start gap-2">
                <Link href="/dashboard">
                  <Users className="size-4" />
                  Student Dashboard
                </Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="w-full justify-start gap-2">
                <Link href="/">
                  <Activity className="size-4" />
                  Homepage
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
