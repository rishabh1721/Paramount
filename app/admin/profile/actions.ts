"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateProfileAction(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const name = formData.get("name") as string;
  const image = formData.get("image") as string;

  // Build update object with only non-empty values
  const updateData: { name?: string; image?: string } = {};

  if (name && name.trim()) {
    updateData.name = name.trim();
  }

  if (image && image.trim()) {
    updateData.image = image.trim();
  }

  // Only update if there's data to update
  if (Object.keys(updateData).length > 0) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });
  }

  revalidatePath("/admin/profile");
  revalidatePath("/admin");
  redirect("/admin");
}
