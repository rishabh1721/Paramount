import { env } from '@/lib/env';
import { v4 as uuidv4 } from 'uuid';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import arcjet, { detectBot, fixedWindow } from '@/lib/arcjet';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { requireAdmin } from '@/app/data/admin/require-admin';

export const fileUploadSchema = z.object({
  fileName: z.string().min(1, {
    message: "File name is required"
  }),
  contentType: z.string().min(1, {
    message: "Content type is required"
  }),
  size: z.number().min(1, { message: "Size is required" }),
  isImage: z.boolean(),
});

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

// Initialize S3 Client for Tigris
const s3Client = new S3Client({
  region: 'auto',
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
  endpoint: env.AWS_ENDPOINT_URL_S3,
  forcePathStyle: false,
});

export async function POST(request: Request) {
  try {
    // ✅ Move requireAdmin inside try-catch
    const session = await requireAdmin();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 }
      );
    }

    const decision = await aj.protect(request, {
      fingerprint: session.user.id,
    });

    if (decision.isDenied()) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Try again later." },
        { status: 429 }
      );
    }
    
    const body = await request.json();
    const validation = fileUploadSchema.safeParse(body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { fileName, contentType } = validation.data;
    
    // Sanitize filename
    const sanitizedFileName = fileName
      .replace(/\s+/g, '-')
      .replace(/[^a-zA-Z0-9._-]/g, '')
      .toLowerCase();
    
    const uniqueKey = `${uuidv4()}-${sanitizedFileName}`;

    // Create presigned URL command
    const command = new PutObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
      Key: uniqueKey,
    });

    // Generate presigned URL
    const presignedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 360,
    });

    console.log('✅ Generated presigned URL for:', uniqueKey);

    return NextResponse.json({
      presignedUrl,
      key: uniqueKey,
      fileUrl: `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.fly.storage.tigris.dev/${uniqueKey}`,
    });
    
  } catch (error) {
    console.error('❌ Error in upload API:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      // Check if it's an auth error
      if (error.message.includes('Unauthorized') || error.message.includes('admin')) {
        return NextResponse.json(
          { error: "Unauthorized - Admin access required" },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { 
          error: "Failed to generate upload URL", 
          details: error.message 
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
