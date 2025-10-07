import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { requireAdmin } from "./require-admin";

export async function adminGetLesson(id: string){
  const user = await requireAdmin();

  const data = await prisma.lesson.findUnique({
    where: {
      id: id,
    },
    select: {
      title: true,
      thumbnailKey: true,
      videoKey: true,
      description: true,
      id: true,
      position: true,
    },
  });

  if(!data){
    return notFound();
  }

  console.log('📚 Lesson data fetched:', {
    id: data.id,
    hasVideo: !!data.videoKey,
    hasThumbnail: !!data.thumbnailKey,
    videoKey: data.videoKey?.substring(0, 30) + '...',
    thumbnailKey: data.thumbnailKey?.substring(0, 30) + '...',
  });

  return data;
}

export type AdminLessonSingularType = Awaited<ReturnType<typeof adminGetLesson>>;
