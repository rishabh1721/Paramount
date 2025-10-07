import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CourseCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="w-full aspect-video" />
      <CardContent className="p-5 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        <div className="h-px bg-border" />
        <div className="flex items-center gap-6">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-24" />
        </div>
        <Skeleton className="h-10 w-full" />
      </CardContent>
    </Card>
  );
}

export function CoursesGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CourseCardSkeleton key={i} />
      ))}
    </div>
  );
}
