import { env } from '../config/env';
import { requestWithRetry } from '../utils/http';
import { logger } from '../utils/logger';
import { PlatformPostInput, PublishResult } from '../utils/types';
import { SocialPlatformService } from './platform.interface';

export class YouTubeService implements SocialPlatformService {
  readonly name = 'youtube' as const;

  async publishPost(input: PlatformPostInput): Promise<PublishResult> {
    try {
      if (!env.YOUTUBE_API_KEY || !env.YOUTUBE_CHANNEL_ID) {
        return { platform: this.name, success: true, externalPostId: `mock_yt_${Date.now()}`, postedAt: new Date().toISOString() };
      }
      const response = await requestWithRetry<{ id: string }>({
        method: 'POST',
        url: `https://www.googleapis.com/upload/youtube/v3/videos?part=snippet,status&key=${env.YOUTUBE_API_KEY}`,
        headers: { 'Content-Type': 'application/json' },
        data: {
          snippet: { title: input.caption.slice(0, 90), description: `${input.caption}\n${input.mediaUrl}`, channelId: env.YOUTUBE_CHANNEL_ID },
          status: { privacyStatus: 'public' }
        }
      });
      return { platform: this.name, success: true, externalPostId: response.id, postedAt: new Date().toISOString() };
    } catch (error) {
      logger.error('YouTube publish failed', { error });
      return { platform: this.name, success: false, error: (error as Error).message, postedAt: new Date().toISOString() };
    }
  }
}
