import { requestWithRetry } from '../utils/http';
import { CloudinaryService } from './cloudinary.service';
import { GoogleDriveService } from './google-drive.service';
import { env } from '../config/env';

const PLATFORM_DIMENSIONS = {
  facebook: { width: 1080, height: 1080 },
  instagram_feed: { width: 1080, height: 1080 },
  instagram_reels: { width: 1080, height: 1920 },
  linkedin: { width: 1080, height: 1350 },
  twitter: { width: 1600, height: 900 },
  tiktok: { width: 1080, height: 1920 },
  youtube_shorts: { width: 1080, height: 1920 }
};

export class MediaService {
  constructor(
    private cloudinaryService = new CloudinaryService(),
    private driveService = new GoogleDriveService()
  ) {}

  async processImages(originalFilePath: string): Promise<{ originalUrl: string; variants: Record<string, string> }> {
    const originalUrl = await this.cloudinaryService.uploadMedia(originalFilePath, 'dishnet/originals');
    await this.driveService.archiveFile(`dishnet-${Date.now()}`, originalUrl);

    const variants: Record<string, string> = {};
    for (const [key, dimension] of Object.entries(PLATFORM_DIMENSIONS)) {
      variants[key] = await this.cloudinaryService.transformImage(originalUrl, dimension.width, dimension.height);
    }
    return { originalUrl, variants };
  }

  async generateVerticalPromoVideo(imageUrl: string): Promise<{ jobId: string }> {
    const response = await requestWithRetry<{ jobId: string }>({
      method: 'POST',
      url: `${env.VIDEO_JOB_API_URL}/jobs`,
      headers: { Authorization: `Bearer ${env.VIDEO_JOB_API_KEY}` },
      data: { imageUrl, durationSeconds: 8, output: { width: 1080, height: 1920 } }
    });
    return response;
  }

  async pollVideoJob(jobId: string): Promise<{ status: string; videoUrl?: string }> {
    return requestWithRetry<{ status: string; videoUrl?: string }>({
      method: 'GET',
      url: `${env.VIDEO_JOB_API_URL}/jobs/${jobId}`,
      headers: { Authorization: `Bearer ${env.VIDEO_JOB_API_KEY}` }
    });
  }
}
