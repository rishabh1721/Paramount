import { requireUser } from "@/app/data/user/require-user";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { InstructorApplicationForm } from "./_components/InstructorApplicationForm";
import { ApplicationStatus } from "./_components/ApplicationStatus";

export default async function BecomeInstructorPage() {
  const user = await requireUser();

  // If already instructor/admin, redirect to admin panel
  if (user.role === "admin" || user.role === "instructor") {
    redirect("/admin");
  }

  // Check for existing application
  const existingApplication = await prisma.instructorApplication.findUnique({
    where: { userId: user.id },
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 py-12">
      <div className="container max-w-4xl mx-auto px-4">
        {existingApplication ? (
          <ApplicationStatus application={existingApplication} />
        ) : (
          <InstructorApplicationForm userId={user.id} userName={user.name} />
        )}
      </div>
    </div>
  );
}
