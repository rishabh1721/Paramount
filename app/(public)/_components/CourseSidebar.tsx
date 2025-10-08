"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Clock, BarChart, Award, ShoppingCart, Heart, Loader2, Play } from "lucide-react";
import { CourseDetailType } from "@/app/data/course/get-all-courses";
import { useState, useTransition } from "react";
import { enrollInCourseAction } from "../courses/[slug]/actions";
import { toast } from "sonner";
import Link from "next/link";

interface CourseSidebarProps {
  course: NonNullable<CourseDetailType>;
  isEnrolled?: boolean;
}

export function CourseSidebar({ course, isEnrolled = false }: CourseSidebarProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [enrolled, setEnrolled] = useState(isEnrolled);

  const handleEnroll = async () => {
    startTransition(async () => {
      const result = await enrollInCourseAction(course.id);
      
      if (result.status === "success") {
        toast.success(result.message);
        setEnrolled(true); // Update local state
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <div className="space-y-6 lg:sticky lg:top-24">
      {/* Price Card */}
      <Card className="border-2 shadow-xl">
        <CardHeader className="text-center pb-4">
          {!enrolled ? (
            <div className="flex items-center justify-center gap-3 mb-4">
              <DollarSign className="size-8 text-primary" />
              <div>
                <p className="text-4xl font-bold text-primary">${course.price}</p>
                <p className="text-sm text-muted-foreground">
                  {course.price === 0 ? "Free" : "One-time payment"}
                </p>
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <Badge className="text-base px-4 py-2">
                ✓ Enrolled
              </Badge>
            </div>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {enrolled ? (
            <Button 
              size="lg" 
              className="w-full text-base font-semibold"
              asChild
            >
              <Link href={`/learn/${course.slug}`}>
                <Play className="mr-2 size-5" />
                Watch Now
              </Link>
            </Button>
          ) : (
            <Button 
              size="lg" 
              className="w-full text-base font-semibold"
              onClick={handleEnroll}
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ShoppingCart className="mr-2 size-5" />
                  {course.price === 0 ? "Enroll Free" : "Enroll Now"}
                </>
              )}
            </Button>
          )}
          
          <Button
            size="lg"
            variant="outline"
            className="w-full"
            onClick={() => setIsWishlisted(!isWishlisted)}
            disabled={isPending}
          >
            <Heart className={`mr-2 size-5 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
            {isWishlisted ? 'Saved' : 'Add to Wishlist'}
          </Button>
        </CardContent>
      </Card>

      {/* Course Includes */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">This Course Includes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3">
            <Clock className="size-5 text-primary shrink-0" />
            <span className="text-sm">{course.duration} hours of content</span>
          </div>
          <div className="flex items-center gap-3">
            <BarChart className="size-5 text-primary shrink-0" />
            <span className="text-sm">{course.level} level</span>
          </div>
          <div className="flex items-center gap-3">
            <Award className="size-5 text-primary shrink-0" />
            <span className="text-sm">Certificate of completion</span>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {[
            "Lifetime access",
            "30-day money-back guarantee",
            "Mobile and TV access",
            "Assignments and quizzes",
          ].map((feature, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <div className="size-1.5 rounded-full bg-primary" />
              <span className="text-sm">{feature}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
