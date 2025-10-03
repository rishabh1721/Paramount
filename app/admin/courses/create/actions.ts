"use server";
import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { courseSchema, CourseSchemaType } from "@/lib/zodSchemas";
import { request } from "@arcjet/next";

const aj = arcjet.withRule(
  detectBot({
    mode: "LIVE",
    allow: [],
  })
).withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  })
);

export async function Createcourse(data: CourseSchemaType): Promise<ApiResponse> {
  const session = await requireAdmin();
  try {
    const req = await request();

    const decision = await aj.protect(req, {
      fingerprint: session.user.id,
    });
    if(decision.isDenied()){
      if(decision.reason.isRateLimit()){
        return{
          status: "error",
          message: "You have been blocked due to rate limiting",

        };

      }
      else{
        return{
          status: "error",
          message: "You are a bot! If this is a mistake contact our support",
        };
      }
    }
    
    // Check if user is authenticated
    if (!session?.user?.id) {
      console.error('❌ No user session found');
      return {
        status: "error",
        message: "You must be logged in to create a course",
      };
    }
    
    // Validate data
    const validation = courseSchema.safeParse(data);
    
    if (!validation.success) {
      console.error('❌ Validation failed:', validation.error.issues);
      return {
        status: "error",
        message: "Invalid form data: " + validation.error.issues.map(i => i.message).join(', '),
      };
    }
    
    console.log('✅ Validation passed, creating course...');
    
    // Create course in database
    const course = await prisma.course.create({
      data: {
        title: validation.data.title,
        slug: validation.data.slug,
        description: validation.data.description,
        smallDescription: validation.data.smallDescription,
        fileKey: validation.data.fileKey,
        price: validation.data.price,
        duration: validation.data.duration,
        level: validation.data.level,
        category: validation.data.category,
        status: validation.data.status,
        userId: session.user.id,
      },
    });
    
    console.log('✅ Course created successfully:', course.id);
    
    return {
      status: "success",
      message: "Course created successfully",
    };
    
  } catch (error) {
    // ✅ FIX: Log the actual error to see what's failing
    console.error('❌ Error creating course:', error);
    
    // Check for specific Prisma errors
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      // Handle specific errors
      if (error.message.includes('Unique constraint')) {
        return {
          status: "error",
          message: "A course with this slug already exists",
        };
      }
      
      if (error.message.includes('Foreign key constraint')) {
        return {
          status: "error",
          message: "Invalid user reference",
        };
      }
      
      return {
        status: "error",
        message: `Failed to create course: ${error.message}`,
      };
    }
    
    return {
      status: "error",
      message: "Failed to create course",
    };
  }
}
