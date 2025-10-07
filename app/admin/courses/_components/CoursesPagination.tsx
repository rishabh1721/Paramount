"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface CoursesPaginationProps {
  currentPage: number;
  totalPages: number;
  totalCount: number;
}

export function CoursesPagination({ currentPage, totalPages, totalCount }: CoursesPaginationProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', newPage.toString());
    router.push(`/admin/courses?${params.toString()}`);
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between border-t pt-6">
      <p className="text-sm text-muted-foreground">
        Showing page <span className="font-semibold">{currentPage}</span> of{" "}
        <span className="font-semibold">{totalPages}</span> ({totalCount} total courses)
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="size-4 mr-1" />
          Previous
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            let pageNum;
            if (totalPages <= 5) {
              pageNum = i + 1;
            } else if (currentPage <= 3) {
              pageNum = i + 1;
            } else if (currentPage >= totalPages - 2) {
              pageNum = totalPages - 4 + i;
            } else {
              pageNum = currentPage - 2 + i;
            }

            return (
              <Button
                key={pageNum}
                variant={currentPage === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(pageNum)}
                className="w-9"
              >
                {pageNum}
              </Button>
            );
          })}
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
          <ChevronRight className="size-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}
