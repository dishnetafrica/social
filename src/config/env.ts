import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.string().default('development'),
  PORT: z.coerce.number().default(3000),
  OPENAI_API_KEY: z.string().min(1),
  OPENAI_MODEL: z.string().default('gpt-4o-mini'),
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  FACEBOOK_PAGE_ACCESS_TOKEN: z.string().optional(),
  FACEBOOK_PAGE_ID: z.string().optional(),
  INSTAGRAM_BUSINESS_ID: z.string().optional(),
  LINKEDIN_ACCESS_TOKEN: z.string().optional(),
  LINKEDIN_ORGANIZATION_URN: z.string().optional(),
  TWITTER_BEARER_TOKEN: z.string().optional(),
  TWITTER_USER_ID: z.string().optional(),
  TIKTOK_ACCESS_TOKEN: z.string().optional(),
  TIKTOK_OPEN_ID: z.string().optional(),
  YOUTUBE_API_KEY: z.string().optional(),
  YOUTUBE_CHANNEL_ID: z.string().optional(),
  GOOGLE_DRIVE_CLIENT_EMAIL: z.string().optional(),
  GOOGLE_DRIVE_PRIVATE_KEY: z.string().optional(),
  GOOGLE_DRIVE_FOLDER_ID: z.string().optional(),
  GOOGLE_SHEET_ID: z.string().optional(),
  WHATSAPP_NUMBER: z.string().default('255000000000'),
  WHATSAPP_PREFILL_TEXT: z.string().default('Hello DishNet Africa, I need internet package details.'),
  VIDEO_JOB_API_URL: z.string().url().default('https://example-video-api.local'),
  VIDEO_JOB_API_KEY: z.string().default('dev-key')
});

export const env = envSchema.parse(process.env);
