"use client";
import { AdminCourseType } from "@/app/data/admin/admin-get-courses";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { ArrowRight, Eye, MoreVertical, Pencil, School, TimerIcon, Trash2, ImageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface iAppProps {
  data: AdminCourseType;
}

export function AdminCourseCard({ data }: iAppProps) {
  const thumbnailUrl = useConstructUrl(data.fileKey);
  
  return (
    <Card className="transition duration-300 bg-background shadow-lg hover:shadow-[0_4px_32px_0_rgba(0,0,0,0.12),0_0_16px_2px_rgba(255,255,255,0.10)] hover:scale-[1.02] hover:border hover:border-primary/30 rounded-2xl max-w-sm w-full group relative overflow-hidden">
      
      {/* Dropdown Menu Button - Orange and Always Visible */}
      <div className="absolute top-3 right-3 z-20">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="secondary" 
              size="icon" 
              className="size-9 text-shadow-primary-foreground rounded-xl" 
            >
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52 backdrop-blur-xl bg-background/95 border-border/50 shadow-2xl rounded-xl">
            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${data.id}/edit`} className="cursor-pointer rounded-lg hover:bg-primary/10 transition-colors duration-200 py-2.5">
                <Pencil className="size-4 mr-2.5" />
                Edit Course
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href={`/courses/${data.slug}`} className="cursor-pointer rounded-lg hover:bg-primary/10 transition-colors duration-200 py-2.5">
                <Eye className="size-4 mr-2.5" />
                Preview
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-border/50" />
            <DropdownMenuItem asChild>
              <Link href={`/admin/courses/${data.id}/delete`} className="cursor-pointer text-destructive focus:text-destructive rounded-lg hover:bg-destructive/10 transition-colors duration-200 py-2.5">
                <Trash2 className="size-4 mr-2.5" />
                Delete Course
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Thumbnail Image - Completely Fills Container with Fallback */}
      <div className="relative w-full aspect-video overflow-hidden bg-muted rounded-t-2xl">
        {thumbnailUrl ? (
          <>
            <Image 
              src={thumbnailUrl} 
              alt={data.title}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted">
            <ImageIcon className="size-16 text-muted-foreground/30" />
          </div>
        )}
      </div>

      {/* Card Content */}
      <CardContent className="p-5 space-y-4">
        
        {/* Title Section */}
        <div className="space-y-2">
          <Link 
            href={`/admin/courses/${data.id}/edit`} 
            className="font-bold text-lg line-clamp-2 hover:text-primary transition-colors duration-200 block leading-tight"
          >
            {data.title}
          </Link>
          <p className="line-clamp-2 text-sm text-muted-foreground leading-relaxed">
            {data.smallDescription}
          </p>
        </div>

        {/* Divider */}
        <div className="h-px bg-border my-4" />

        {/* Metadata */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center size-10 rounded-xl bg-primary/10 border border-primary/20">
              <TimerIcon className="size-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground/70 font-medium uppercase tracking-wider">Duration</span>
              <span className="text-sm font-bold text-foreground">
                {data.duration}h
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center size-10 rounded-xl bg-primary/10 border border-primary/20">
              <School className="size-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-[10px] text-muted-foreground/70 font-medium uppercase tracking-wider">Level</span>
              <span className="text-sm font-bold text-foreground capitalize">
                {data.level}
              </span>
            </div>
          </div>
        </div>

        {/* Edit Button */}
        <Link 
          href={`/admin/courses/${data.id}/edit`} 
          className={buttonVariants({
            className: "w-full mt-4 group/button py-5 text-sm font-semibold rounded-xl transition-all duration-300",
          })}
        >
          <span className="flex items-center justify-center gap-2">
            Edit Course 
            <ArrowRight className="size-4 transition-transform duration-300 group-hover/button:translate-x-1" />
          </span>
        </Link>
      </CardContent>
    </Card>
  );
}
