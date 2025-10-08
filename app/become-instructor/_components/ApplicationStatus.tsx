"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ApplicationStatus({ application }: { application: any }) {
  const statusConfig = {
    Pending: {
      icon: Clock,
      color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      title: "Application Under Review",
      description: "We're reviewing your application. You'll hear from us within 2-3 business days.",
    },
    Approved: {
      icon: CheckCircle2,
      color: "bg-green-500/10 text-green-500 border-green-500/20",
      title: "Application Approved!",
      description: "Congratulations! You can now access the instructor dashboard.",
    },
    Rejected: {
      icon: XCircle,
      color: "bg-red-500/10 text-red-500 border-red-500/20",
      title: "Application Not Approved",
      description: "Unfortunately, your application was not approved at this time. You can reapply after 30 days.",
    },
  };

  const config = statusConfig[application.status as keyof typeof statusConfig];
  const Icon = config.icon;

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in-0 zoom-in-95 duration-500">
      <Card className="border-border/50 shadow-2xl">
        <CardHeader className="text-center pb-8">
          <div className="flex justify-center mb-6">
            <div className={`p-4 rounded-2xl border ${config.color}`}>
              <Icon className="size-12" />
            </div>
          </div>
          <CardTitle className="text-2xl">{config.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-center text-muted-foreground text-lg">{config.description}</p>
          
          <div className="space-y-3 pt-6 border-t">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Status:</span>
              <Badge variant="outline" className={config.color}>
                {application.status}
              </Badge>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Submitted:</span>
              <span className="font-medium">{new Date(application.submittedAt).toLocaleDateString()}</span>
            </div>
            {application.reviewedAt && (
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Reviewed:</span>
                <span className="font-medium">{new Date(application.reviewedAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>

          {application.status === "Approved" && (
            <Button asChild size="lg" className="w-full mt-6">
              <Link href="/admin">
                Go to Instructor Dashboard
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
