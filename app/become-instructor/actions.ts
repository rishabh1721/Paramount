"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function submitInstructorApplicationAction(data: {
  fullName: string;
  bio: string;
  expertise: string;
  experience: string;
  motivation: string;
}) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return { status: "error", message: "Unauthorized" };
    }

    // Check if already applied
    const existing = await prisma.instructorApplication.findUnique({
      where: { userId: session.user.id },
    });

    if (existing) {
      return { status: "error", message: "You have already submitted an application" };
    }

    // Create application
    await prisma.instructorApplication.create({
      data: {
        userId: session.user.id,
        fullName: data.fullName,
        bio: data.bio,
        expertise: data.expertise,
        experience: data.experience,
        motivation: data.motivation,
      },
    });

    revalidatePath("/become-instructor");
    return { 
      status: "success", 
      message: "Application submitted successfully! We'll review it soon." 
    };
  } catch (error) {
    console.error("Error submitting application:", error);
    return { status: "error", message: "Failed to submit application" };
  }
}
