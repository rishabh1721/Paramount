"use client";
import { Button } from "@/components/ui/button";
import { courseCategories, courseLevels, courseSchema, CourseSchemaType, courseStatus } from "@/lib/zodSchemas";
import { PlusIcon, SparkleIcon, Loader2Icon, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import slugify from 'slugify';
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { Uploader } from "@/components/file-uploader/Uploader";
import { useTransition, useEffect } from "react";
import { tryCatch } from "@/hooks/try-catch";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { editCourse } from "../actions";
import { AdminCourseSingularType } from "@/app/data/admin/admin-get-course";

interface iAppProps {
  data: AdminCourseSingularType;
}

export function EditCourseForm({ data }: iAppProps) {
  const [pending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<CourseSchemaType>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: data.title,
      description: data.description,
      smallDescription: data.smallDescription,
      fileKey: data.fileKey,
      price: data.price,
      duration: data.duration,
      level: data.level,
      status: data.status,
      category: data.category as CourseSchemaType["category"],
      slug: data.slug,
    },
  });

  // Watch fileKey for debugging
  const fileKey = form.watch("fileKey");

  useEffect(() => {
    console.log('📊 Course thumbnail updated:', {
      fileKey: fileKey?.substring(0, 50),
      extension: fileKey?.split('.').pop(),
      isVideo: fileKey?.includes('.mp4') || fileKey?.includes('.webm'),
    });
  }, [fileKey]);

  function onSubmit(values: CourseSchemaType) {
    console.log('📤 Submitting course update:', {
      title: values.title,
      fileKey: values.fileKey?.substring(0, 50),
      extension: values.fileKey?.split('.').pop(),
    });

    // Validation: ensure thumbnail is an image
    if (values.fileKey && (values.fileKey.includes('.mp4') || values.fileKey.includes('.webm') || values.fileKey.includes('.mov') || values.fileKey.includes('.avi'))) {
      console.error('❌ ERROR: Thumbnail contains a video file!', values.fileKey);
      toast.error("Error: Thumbnail must be an image file, not a video.");
      return;
    }

    startTransition(async () => {
      const { data: result, error } = await tryCatch(editCourse(values, data.id));

      if (error) {
        console.error('❌ Update error:', error);
        toast.error("An unexpected error occurred. Please try again.");
        return;
      }

      if (result.status === 'success') {
        console.log('✅ Course updated successfully');
        toast.success(result.message);
        router.push("/admin/courses");
      } else if (result.status === "error") {
        console.error('❌ Update failed:', result.message);
        toast.error(result.message);
      }
    });
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        {/* Title Field */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter course title"
                  disabled={pending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Slug Field with Generator */}
        <div className="flex gap-4 items-end">
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Slug</FormLabel>
                <FormControl>
                  <Input
                    placeholder="course-slug"
                    disabled={pending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="secondary"
            className="w-full sm:w-fit shrink-0"
            disabled={pending || !form.watch("title")}
            onClick={() => {
              const titleValue = form.getValues("title");
              if (titleValue) {
                const slug = slugify(titleValue, { lower: true, strict: true });
                form.setValue('slug', slug);
                toast.success("Slug generated!");
              }
            }}
          >
            <SparkleIcon className="mr-1.5 size-4" />
            Generate Slug
          </Button>
        </div>

        {/* Small Description */}
        <FormField
          control={form.control}
          name="smallDescription"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Small Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Brief description for preview cards"
                  className="min-h-[120px]"
                  disabled={pending}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Full Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Description</FormLabel>
              <FormControl>
                <RichTextEditor field={field} disabled={pending} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Thumbnail Image */}
        <FormField
          control={form.control}
          name="fileKey"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Thumbnail Image</FormLabel>
              <FormControl>
                <div className="space-y-3">
                  <Uploader
                    key={`course-thumbnail-${data.id}-${field.value || 'empty'}`}
                    onChange={(value) => {
                      console.log('🖼️ Course thumbnail onChange:', {
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
                          toast.success('Thumbnail cleared. Upload a new image.');
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

        {/* Category, Level, Duration, Price Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={pending}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {courseCategories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Level</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={pending}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Level" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {courseLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Duration (hours)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Duration"
                    type="number"
                    min="1"
                    disabled={pending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Price ($)</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Price"
                    type="number"
                    min="0"
                    step="0.01"
                    disabled={pending}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Status */}
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Status</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={pending}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {courseStatus.map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit" disabled={pending}>
          {pending ? (
            <>
              <Loader2Icon className="mr-2 size-4 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              Update Course <PlusIcon className="ml-1" size={16} />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
