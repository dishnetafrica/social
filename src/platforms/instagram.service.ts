import { env } from '../config/env';
import { requestWithRetry } from '../utils/http';
import { logger } from '../utils/logger';
import { PlatformPostInput, PublishResult } from '../utils/types';
import { SocialPlatformService } from './platform.interface';

export class InstagramService implements SocialPlatformService {
  readonly name = 'instagram' as const;

  async publishPost(input: PlatformPostInput): Promise<PublishResult> {
    try {
      if (!env.FACEBOOK_PAGE_ACCESS_TOKEN || !env.INSTAGRAM_BUSINESS_ID) {
        return this.mockResult();
      }
      const mediaType = input.mediaType === 'video' ? 'REELS' : 'IMAGE';
      const createUrl = `https://graph.facebook.com/v21.0/${env.INSTAGRAM_BUSINESS_ID}/media`;
      const createPayload = new URLSearchParams({
        image_url: input.mediaType === 'image' ? input.mediaUrl : '',
        video_url: input.mediaType === 'video' ? input.mediaUrl : '',
        caption: input.caption,
        media_type: mediaType,
        access_token: env.FACEBOOK_PAGE_ACCESS_TOKEN
      }).toString();
      const created = await requestWithRetry<{ id: string }>({ method: 'POST', url: createUrl, headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, data: createPayload });
      const publishUrl = `https://graph.facebook.com/v21.0/${env.INSTAGRAM_BUSINESS_ID}/media_publish`;
      const publishPayload = new URLSearchParams({ creation_id: created.id, access_token: env.FACEBOOK_PAGE_ACCESS_TOKEN }).toString();
      const published = await requestWithRetry<{ id: string }>({ method: 'POST', url: publishUrl, headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, data: publishPayload });
      return { platform: this.name, success: true, externalPostId: published.id, postedAt: new Date().toISOString() };
    } catch (error) {
      logger.error('Instagram publish failed', { error });
      return { platform: this.name, success: false, error: (error as Error).message, postedAt: new Date().toISOString() };
    }
  }

  private mockResult(): PublishResult {
    return { platform: this.name, success: true, externalPostId: `mock_ig_${Date.now()}`, postedAt: new Date().toISOString() };
  }
}
