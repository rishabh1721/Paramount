"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Clock, BookOpen, ArrowRight, ImageIcon, DollarSign } from "lucide-react";
import Link from "next/link";
import { PublicCourseType } from "@/app/data/course/get-all-courses";
import { useConstructUrl } from "@/hooks/use-construct-url";

interface PublicCourseCardProps {
  course: PublicCourseType;
}

export function PublicCourseCard({ course }: PublicCourseCardProps) {
  const thumbnailUrl = useConstructUrl(course.fileKey);

  return (
    <Card className="p-0 transition duration-300 bg-background shadow-lg hover:shadow-[0_4px_32px_0_rgba(0,0,0,0.12),0_0_16px_2px_rgba(255,255,255,0.10)] hover:scale-[1.02] hover:border hover:border-primary/30 rounded-2xl w-full group relative overflow-hidden">
      
      {/* Thumbnail Image - Larger Height */}
      <div className="relative w-full aspect-[16/10] overflow-hidden bg-muted rounded-t-2xl">
        {thumbnailUrl ? (
          <>
            <img
              src={thumbnailUrl} 
              alt={course.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <ImageIcon className="size-20 text-muted-foreground/30" />
          </div>
        )}

        {/* Only Level Badge on Image */}
        <div className="absolute bottom-3 left-3">
          <Badge 
            variant="outline" 
            className="backdrop-blur-xl bg-background/90 border-border/50 shadow-lg font-medium"
          >
            {course.level}
          </Badge>
        </div>

        {/* Chapters Count on Image */}
        {course._count?.chapters && (
          <div className="absolute bottom-3 right-3">
            <Badge 
              variant="secondary" 
              className="backdrop-blur-xl bg-background/90 border-border/50 shadow-lg text-xs"
            >
              <BookOpen className="size-3 mr-1" />
              {course._count.chapters} chapters
            </Badge>
          </div>
        )}
      </div>

      {/* Card Content - More Padding */}
      <CardContent className="p-6 space-y-5">
        
        {/* Category & Price Row */}
        <div className="flex items-center justify-between gap-3">
          <Badge variant="secondary" className="font-medium text-xs">
            {course.category}
          </Badge>
          <div className="flex items-center gap-1.5 bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-lg">
            <DollarSign className="size-4 text-primary" />
            <span className="text-base font-bold text-primary">{course.price}</span>
          </div>
        </div>

        {/* Title & Description */}
        <div className="space-y-2">
          <Link 
            href={`/courses/${course.slug}`} 
            className="font-bold text-xl line-clamp-2 hover:text-primary transition-colors duration-200 block leading-tight"
          >
            {course.title}
          </Link>
          <p className="line-clamp-3 text-sm text-muted-foreground leading-relaxed">
            {course.smallDescription}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-border my-4" />

        {/* Metadata - 2 Columns */}
        <div className="grid grid-cols-2 gap-4">
          {/* Duration */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center size-10 rounded-xl bg-primary/10 border border-primary/20">
              <Clock className="size-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground/70 font-medium uppercase tracking-wider">Duration</span>
              <span className="text-sm font-bold text-foreground">
                {course.duration}h
              </span>
            </div>
          </div>

          {/* Instructor Info */}
          {course.user && (
            <div className="flex items-center gap-2.5">
              <div className="flex items-center justify-center size-10 rounded-xl bg-primary/10 border border-primary/20 overflow-hidden">
                {course.user.image ? (
                  <img
                    src={course.user.image}
                    alt={course.user.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs font-bold text-primary">
                    {course.user.name.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-muted-foreground/70 font-medium uppercase tracking-wider">Instructor</span>
                <span className="text-sm font-bold text-foreground truncate max-w-[120px]">
                  {course.user.name}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* View Course Button - Larger */}
        <Link 
          href={`/courses/${course.slug}`} 
          className={buttonVariants({
            className: "w-full mt-4 group/button py-6 text-base font-semibold rounded-xl transition-all duration-300",
          })}
        >
          <span className="flex items-center justify-center gap-2">
            View Course Details
            <ArrowRight className="size-4 transition-transform duration-300 group-hover/button:translate-x-1" />
          </span>
        </Link>
      </CardContent>
    </Card>
  );
}
