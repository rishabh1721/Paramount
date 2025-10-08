import { requireUser } from "@/app/data/user/require-user";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { ApplicationsList } from "./_components/ApplicationsList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Clock, Check, X } from "lucide-react";

export default async function ApplicationsPage() {
  const user = await requireUser();

  // if (user.role !== "admin") {
  //   redirect("/admin");
  // }

  const [pendingApplications, approvedApplications, rejectedApplications] = await Promise.all([
    prisma.instructorApplication.findMany({
      where: { status: "Pending" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        submittedAt: "desc",
      },
    }),
    prisma.instructorApplication.findMany({
      where: { status: "Approved" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        submittedAt: "desc",
      },
    }),
    prisma.instructorApplication.findMany({
      where: { status: "Rejected" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
      },
      orderBy: {
        submittedAt: "desc",
      },
    }),
  ]);

  const stats = {
    pending: pendingApplications.length,
    approved: approvedApplications.length,
    rejected: rejectedApplications.length,
  };

  return (
    <div className="flex flex-col gap-6 md:gap-8 pb-8">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Instructor Applications</h1>
        <p className="text-muted-foreground">
          Review and manage instructor applications
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-4 rounded-lg border bg-gradient-to-br from-yellow-500/5 to-card shadow-sm">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Clock className="size-4" />
            Pending
          </p>
          <p className="text-3xl font-bold mt-2">{stats.pending}</p>
        </div>
        <div className="p-4 rounded-lg border bg-gradient-to-br from-green-500/5 to-card shadow-sm">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <Check className="size-4" />
            Approved
          </p>
          <p className="text-3xl font-bold text-green-500 mt-2">{stats.approved}</p>
        </div>
        <div className="p-4 rounded-lg border bg-gradient-to-br from-red-500/5 to-card shadow-sm">
          <p className="text-sm text-muted-foreground flex items-center gap-2">
            <X className="size-4" />
            Rejected
          </p>
          <p className="text-3xl font-bold text-red-500 mt-2">{stats.rejected}</p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pending" className="space-y-6">
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="size-4" />
            Pending
            {stats.pending > 0 && (
              <Badge variant="secondary" className="ml-1">
                {stats.pending}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="approved" className="gap-2">
            <Check className="size-4" />
            Approved
            <Badge variant="secondary" className="ml-1">
              {stats.approved}
            </Badge>
          </TabsTrigger>
          <TabsTrigger value="rejected" className="gap-2">
            <X className="size-4" />
            Rejected
            <Badge variant="secondary" className="ml-1">
              {stats.rejected}
            </Badge>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          <ApplicationsList applications={pendingApplications} />
        </TabsContent>

        <TabsContent value="approved">
          <ApplicationsList applications={approvedApplications} />
        </TabsContent>

        <TabsContent value="rejected">
          <ApplicationsList applications={rejectedApplications} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
