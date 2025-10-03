import "server-only";
import { S3Client } from '@aws-sdk/client-s3';
import { env } from './env';

export const S3 = new S3Client({
  region: 'auto', // Required for Tigris
  endpoint: env.AWS_ENDPOINT_URL_S3, // e.g. https://fly.storage.tigris.dev
  forcePathStyle: false, // Critical fix
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
});
