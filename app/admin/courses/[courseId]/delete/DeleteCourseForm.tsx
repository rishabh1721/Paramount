"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft, Loader2, Trash2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useTransition, useState } from "react";
import { toast } from "sonner";
import { tryCatch } from "@/hooks/try-catch";
import { useRouter } from "next/navigation";
import { deleteCourse } from "../edit/actions";
import { AdminCourseSingularType } from "@/app/data/admin/admin-get-course";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface DeleteCourseFormProps {
  course: AdminCourseSingularType;
  courseId: string;
}

export function DeleteCourseForm({ course, courseId }: DeleteCourseFormProps) {
  const [pending, startTransition] = useTransition();
  const [confirmText, setConfirmText] = useState("");
  const router = useRouter();

  const isConfirmed = confirmText.trim().toLowerCase() === course.title.trim().toLowerCase();

  function handleDelete() {
    if (!isConfirmed) {
      toast.error("Please type the course title to confirm deletion");
      return;
    }

    startTransition(async () => {
      const { data: result, error } = await tryCatch(deleteCourse(courseId));

      if (error) {
        toast.error("An unexpected error occurred. Please try again.");
        return;
      }

      if (result.status === 'success') {
        toast.success(result.message);
        router.push("/admin/courses");
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="space-y-6">
      {/* Clean Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/courses"
          className="flex items-center justify-center size-10 rounded-xl border hover:bg-muted transition-all"
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Delete Course</h1>
          <p className="text-sm text-muted-foreground mt-1">
            This action cannot be undone
          </p>
        </div>
      </div>

      {/* Warning Card */}
      <Card className="border-2 border-destructive/30 bg-destructive/5">
        <CardHeader>
          <div className="flex items-start gap-4">
            <div className="flex items-center justify-center size-12 rounded-xl bg-destructive/10 border border-destructive/20">
              <AlertTriangle className="size-6 text-destructive" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-xl">Permanent Deletion</CardTitle>
              <CardDescription className="text-base">
                All course data will be permanently removed
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Course Title Display */}
          <div className="p-4 bg-background rounded-xl border-2 border-destructive/20">
            <p className="text-sm text-muted-foreground mb-1">You are deleting:</p>
            <p className="text-xl font-bold text-foreground">{course.title}</p>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Card */}
      <Card className="border-2">
        <CardHeader>
          <CardTitle>Type to Confirm</CardTitle>
          <CardDescription>
            Type <span className="font-semibold text-foreground">{course.title}</span> to proceed
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Input with Validation */}
          <div className="space-y-2">
            <Label htmlFor="confirm-text">Confirmation</Label>
            <div className="relative">
              <Input
                id="confirm-text"
                placeholder="Type course title here..."
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                disabled={pending}
                className={cn(
                  "h-12 pr-12 transition-all",
                  isConfirmed && "border-green-500 ring-2 ring-green-500/20"
                )}
              />
              {isConfirmed && (
                <CheckCircle className="absolute right-3 top-1/2 -translate-y-1/2 size-5 text-green-500" />
              )}
            </div>
            <p className={cn(
              "text-sm",
              isConfirmed ? "text-green-600 font-medium" : "text-muted-foreground"
            )}>
              {isConfirmed ? "✓ Ready to delete" : "Type the full course title to enable deletion"}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="flex-1"
              disabled={pending}
              asChild
            >
              <Link href="/admin/courses">
                <ArrowLeft className="mr-2 size-4" />
                Cancel
              </Link>
            </Button>

            <Button
              type="button"
              variant="destructive"
              size="lg"
              className="flex-1"
              disabled={!isConfirmed || pending}
              onClick={handleDelete}
            >
              {pending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="mr-2 size-4" />
                  Delete Course
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
