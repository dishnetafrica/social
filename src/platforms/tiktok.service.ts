import { env } from '../config/env';
import { requestWithRetry } from '../utils/http';
import { logger } from '../utils/logger';
import { PlatformPostInput, PublishResult } from '../utils/types';
import { SocialPlatformService } from './platform.interface';

export class TikTokService implements SocialPlatformService {
  readonly name = 'tiktok' as const;

  async publishPost(input: PlatformPostInput): Promise<PublishResult> {
    try {
      if (!env.TIKTOK_ACCESS_TOKEN || !env.TIKTOK_OPEN_ID) {
        return { platform: this.name, success: true, externalPostId: `mock_tt_${Date.now()}`, postedAt: new Date().toISOString() };
      }
      const response = await requestWithRetry<{ data: { publish_id: string } }>({
        method: 'POST',
        url: 'https://open.tiktokapis.com/v2/post/publish/video/init/',
        headers: { Authorization: `Bearer ${env.TIKTOK_ACCESS_TOKEN}`, 'Content-Type': 'application/json' },
        data: { post_info: { title: input.caption }, source_info: { source: 'PULL_FROM_URL', video_url: input.mediaUrl } }
      });
      return { platform: this.name, success: true, externalPostId: response.data.publish_id, postedAt: new Date().toISOString() };
    } catch (error) {
      logger.error('TikTok publish failed', { error });
      return { platform: this.name, success: false, error: (error as Error).message, postedAt: new Date().toISOString() };
    }
  }
}
