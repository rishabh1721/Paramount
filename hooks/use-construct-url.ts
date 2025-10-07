"use client";
import { env } from "@/lib/env";

export function useConstructUrl(key: string | null | undefined): string | null {
  if (!key) {
    console.warn('⚠️ useConstructUrl: No key provided');
    return null;
  }
  
  // If it's already a full URL, return it
  if (key.startsWith('http://') || key.startsWith('https://')) {
    console.log('🔗 useConstructUrl: Already full URL', key.substring(0, 50));
    return key;
  }
  
  const url = `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.storage.dev/${key}`;
  
  console.log('🔗 useConstructUrl:', {
    key: key.substring(0, 50),
    bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES,
    url: url.substring(0, 80)
  });
  
  return url;
}
