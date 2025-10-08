"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CheckCircle2, XCircle, Eye, Clock, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { approveApplicationAction, rejectApplicationAction } from "../actions";
import { toast } from "sonner";

export function ApplicationsList({ applications }: { applications: any[] }) {
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleApprove = async (applicationId: string, userId: string) => {
    const result = await approveApplicationAction(applicationId, userId);
    if (result.status === "success") {
      toast.success(result.message);
      window.location.reload();
    } else {
      toast.error(result.message);
    }
  };

  const handleReject = async (applicationId: string) => {
    const result = await rejectApplicationAction(applicationId);
    if (result.status === "success") {
      toast.success(result.message);
      window.location.reload();
    } else {
      toast.error(result.message);
    }
  };

  const viewDetails = (app: any) => {
    setSelectedApp(app);
    setIsDialogOpen(true);
  };

  return (
    <>
      <div className="space-y-4">
        {applications.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No applications yet
            </CardContent>
          </Card>
        ) : (
          applications.map((app) => (
            <Card key={app.id} className="hover:border-primary/30 transition-all">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  {/* User Info */}
                  <div className="flex items-center gap-4 flex-1">
                    <Avatar className="size-12">
                      <AvatarImage src={app.user.image || ""} />
                      <AvatarFallback>
                        {app.user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-lg">{app.fullName}</h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="size-3" />
                        <span>{app.user.email}</span>
                      </div>
                      <p className="text-sm text-primary font-medium mt-1">
                        {app.expertise}
                      </p>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <Badge
                    variant="outline"
                    className={
                      app.status === "Pending"
                        ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                        : app.status === "Approved"
                        ? "bg-green-500/10 text-green-500 border-green-500/20"
                        : "bg-red-500/10 text-red-500 border-red-500/20"
                    }
                  >
                    {app.status === "Pending" && <Clock className="size-3 mr-1" />}
                    {app.status === "Approved" && <CheckCircle2 className="size-3 mr-1" />}
                    {app.status === "Rejected" && <XCircle className="size-3 mr-1" />}
                    {app.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Bio Preview */}
                <div className="space-y-1">
                  <p className="text-sm font-medium">Bio:</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {app.bio}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => viewDetails(app)}
                  >
                    <Eye className="size-4 mr-2" />
                    View Details
                  </Button>

                  {app.status === "Pending" && (
                    <>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleApprove(app.id, app.userId)}
                      >
                        <CheckCircle2 className="size-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleReject(app.id)}
                      >
                        <XCircle className="size-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>

                {/* Submitted Date */}
                <p className="text-xs text-muted-foreground">
                  Submitted on {new Date(app.submittedAt).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
            <DialogDescription>
              Review the full application from {selectedApp?.fullName}
            </DialogDescription>
          </DialogHeader>

          {selectedApp && (
            <div className="space-y-6">
              {/* Applicant Info */}
              <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                <Avatar className="size-16">
                  <AvatarImage src={selectedApp.user.image || ""} />
                  <AvatarFallback>
                    {selectedApp.user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold text-lg">{selectedApp.fullName}</h3>
                  <p className="text-sm text-muted-foreground">{selectedApp.user.email}</p>
                  <p className="text-sm text-primary font-medium mt-1">
                    {selectedApp.expertise}
                  </p>
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <h4 className="font-semibold">Professional Bio</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedApp.bio}
                </p>
              </div>

              {/* Experience */}
              <div className="space-y-2">
                <h4 className="font-semibold">Teaching Experience</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedApp.experience}
                </p>
              </div>

              {/* Motivation */}
              <div className="space-y-2">
                <h4 className="font-semibold">Motivation</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {selectedApp.motivation}
                </p>
              </div>

              {/* Actions */}
              {selectedApp.status === "Pending" && (
                <div className="flex items-center gap-2 pt-4 border-t">
                  <Button
                    variant="default"
                    onClick={() => {
                      handleApprove(selectedApp.id, selectedApp.userId);
                      setIsDialogOpen(false);
                    }}
                  >
                    <CheckCircle2 className="size-4 mr-2" />
                    Approve Application
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleReject(selectedApp.id);
                      setIsDialogOpen(false);
                    }}
                  >
                    <XCircle className="size-4 mr-2" />
                    Reject Application
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
