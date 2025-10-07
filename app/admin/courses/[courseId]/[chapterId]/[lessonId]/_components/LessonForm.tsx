"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button, buttonVariants } from "@/components/ui/button";
import { ArrowLeft, Loader2, SaveIcon, Trash2 } from "lucide-react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTransition, useEffect } from "react";
import { toast } from "sonner";
import { tryCatch } from "@/hooks/try-catch";
import { updateLesson } from "./actions";
import { AdminLessonSingularType } from "@/app/data/admin/admin-get-lesson";
import { Uploader } from "@/components/file-uploader/Uploader";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { z } from "zod";

const lessonFormSchema = z.object({
  title: z.string().min(3, { message: "Title must be at least 3 characters long." }),
  description: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().min(3, { message: "Description must be at least 3 characters long." }).optional()
  ),
  thumbnailKey: z.string().optional(),
  videoKey: z.string().optional(),
});

type LessonFormType = z.infer<typeof lessonFormSchema>;

interface LessonFormProps {
  data: AdminLessonSingularType;
  chapterId: string;
  courseId: string;
  lessonId: string;
}

export function LessonForm({ data, chapterId, courseId, lessonId }: LessonFormProps) {
  const [pending, startTransition] = useTransition();

  console.log('🎬 LessonForm initial data:', {
    lessonId,
    title: data.title,
    videoKey: data.videoKey,
    thumbnailKey: data.thumbnailKey,
    hasVideo: !!data.videoKey,
    hasThumbnail: !!data.thumbnailKey,
  });

  const form = useForm<LessonFormType>({
    resolver: zodResolver(lessonFormSchema),
    defaultValues: {
      title: data.title || "",
      description: data.description || "",
      thumbnailKey: data.thumbnailKey || "",
      videoKey: data.videoKey || "",
    },
  });

  // Watch form values for debugging
  const videoKey = form.watch("videoKey");
  const thumbnailKey = form.watch("thumbnailKey");

  useEffect(() => {
    console.log('📊 Form values updated:', { 
      videoKey: videoKey?.substring(0, 50), 
      thumbnailKey: thumbnailKey?.substring(0, 50),
      videoIsImage: videoKey?.includes('.jpg') || videoKey?.includes('.png') || videoKey?.includes('.jpeg'),
      thumbnailIsVideo: thumbnailKey?.includes('.mp4') || thumbnailKey?.includes('.webm') || thumbnailKey?.includes('.mov'),
    });
  }, [videoKey, thumbnailKey]);

  function onSubmit(values: LessonFormType) {
    console.log('📤 Submitting lesson update:', {
      title: values.title,
      videoKey: values.videoKey?.substring(0, 50),
      thumbnailKey: values.thumbnailKey?.substring(0, 50),
      hasVideo: !!values.videoKey,
      hasThumbnail: !!values.thumbnailKey,
      videoExtension: values.videoKey?.split('.').pop(),
      thumbnailExtension: values.thumbnailKey?.split('.').pop(),
    });

    // Validation check before submitting
    if (values.videoKey && (values.videoKey.includes('.jpg') || values.videoKey.includes('.png') || values.videoKey.includes('.jpeg') || values.videoKey.includes('.gif'))) {
      console.error('❌ ERROR: Video field contains an image file!', values.videoKey);
      toast.error("Error: Video field contains an image. Please clear and upload a video file.");
      return;
    }

    if (values.thumbnailKey && (values.thumbnailKey.includes('.mp4') || values.thumbnailKey.includes('.webm') || values.thumbnailKey.includes('.mov') || values.thumbnailKey.includes('.avi'))) {
      console.error('❌ ERROR: Thumbnail field contains a video file!', values.thumbnailKey);
      toast.error("Error: Thumbnail field contains a video. Please clear and upload an image file.");
      return;
    }
    
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        updateLesson(lessonId, courseId, chapterId, values)
      );

      if (error) {
        console.error('❌ Update error:', error);
        toast.error("An unexpected error occurred. Please try again.");
        return;
      }

      if (result.status === "success") {
        console.log('✅ Update successful');
        toast.success(result.message);
      } else if (result.status === "error") {
        console.error('❌ Update failed:', result.message);
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href={`/admin/courses/${courseId}/edit`}
          className={buttonVariants({
            variant: "outline",
            size: "icon",
          })}
        >
          <ArrowLeft className="size-4" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Edit Lesson</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Update lesson content and details
          </p>
        </div>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information Card */}
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>Update the lesson title and description</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title Field */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lesson Title</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. Introduction to Variables"
                        disabled={pending}
                        className="mt-2"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description Field with RichTextEditor */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <div className="mt-2">
                        <RichTextEditor field={field} disabled={pending} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Video Upload Card */}
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle>Video Content</CardTitle>
              <CardDescription>Upload the lesson video (MP4, WebM, MOV - Max 5GB)</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <FormField
                control={form.control}
                name="videoKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Video</FormLabel>
                    <FormControl>
                      <div className="space-y-3">
                        <Uploader 
                          key={`video-uploader-${lessonId}-${field.value || 'empty'}`}
                          onChange={(value) => {
                            console.log('🎥 Video uploader onChange:', {
                              newValue: value?.substring(0, 50),
                              extension: value?.split('.').pop(),
                              isImage: value?.includes('.jpg') || value?.includes('.png'),
                            });
                            field.onChange(value);
                          }}
                          value={field.value}
                          accept="video/*"
                        />
                        {field.value && (
                          <div className="flex items-center justify-between p-3 bg-muted rounded-lg border">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-foreground mb-1">Current File:</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {field.value.split('/').pop()}
                              </p>
                              {(field.value.includes('.jpg') || field.value.includes('.png') || field.value.includes('.jpeg')) && (
                                <p className="text-xs text-destructive mt-1 font-medium">
                                  ⚠️ Warning: This is an image file, not a video!
                                </p>
                              )}
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                console.log('🗑️ Clearing video field');
                                field.onChange('');
                                toast.success('Video field cleared. Upload a new video.');
                              }}
                              className="ml-3 shrink-0"
                            >
                              <Trash2 className="size-4 mr-2" />
                              Clear
                            </Button>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Thumbnail Upload Card */}
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle>Thumbnail</CardTitle>
              <CardDescription>Upload a thumbnail image (JPG, PNG, WebP - Max 5MB)</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <FormField
                control={form.control}
                name="thumbnailKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Thumbnail Image</FormLabel>
                    <FormControl>
                      <div className="space-y-3">
                        <Uploader 
                          key={`thumbnail-uploader-${lessonId}-${field.value || 'empty'}`}
                          onChange={(value) => {
                            console.log('🖼️ Thumbnail uploader onChange:', {
                              newValue: value?.substring(0, 50),
                              extension: value?.split('.').pop(),
                              isVideo: value?.includes('.mp4') || value?.includes('.webm'),
                            });
                            field.onChange(value);
                          }}
                          value={field.value}
                          accept="image/*"
                        />
                        {field.value && (
                          <div className="flex items-center justify-between p-3 bg-muted rounded-lg border">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-foreground mb-1">Current File:</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {field.value.split('/').pop()}
                              </p>
                              {(field.value.includes('.mp4') || field.value.includes('.webm') || field.value.includes('.mov')) && (
                                <p className="text-xs text-destructive mt-1 font-medium">
                                  ⚠️ Warning: This is a video file, not an image!
                                </p>
                              )}
                            </div>
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              onClick={() => {
                                console.log('🗑️ Clearing thumbnail field');
                                field.onChange('');
                                toast.success('Thumbnail field cleared. Upload a new image.');
                              }}
                              className="ml-3 shrink-0"
                            >
                              <Trash2 className="size-4 mr-2" />
                              Clear
                            </Button>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={pending} size="lg">
              {pending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <SaveIcon className="mr-2 size-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
