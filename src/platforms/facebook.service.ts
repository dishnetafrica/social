import { env } from '../config/env';
import { requestWithRetry } from '../utils/http';
import { logger } from '../utils/logger';
import { PlatformPostInput, PublishResult } from '../utils/types';
import { SocialPlatformService } from './platform.interface';

export class FacebookService implements SocialPlatformService {
  readonly name = 'facebook' as const;

  async publishPost(input: PlatformPostInput): Promise<PublishResult> {
    try {
      if (!env.FACEBOOK_PAGE_ACCESS_TOKEN || !env.FACEBOOK_PAGE_ID) {
        return this.mockResult(input);
      }
      const endpoint = `https://graph.facebook.com/v21.0/${env.FACEBOOK_PAGE_ID}/photos`;
      const payload = new URLSearchParams({
        url: input.mediaUrl,
        caption: input.caption,
        access_token: env.FACEBOOK_PAGE_ACCESS_TOKEN
      }).toString();
      const response = await requestWithRetry<{ post_id?: string; id?: string }>({
        method: 'POST',
        url: endpoint,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        data: payload
      });
      return { platform: this.name, success: true, externalPostId: response.post_id ?? response.id, postedAt: new Date().toISOString() };
    } catch (error) {
      logger.error('Facebook publish failed', { error });
      return { platform: this.name, success: false, error: (error as Error).message, postedAt: new Date().toISOString() };
    }
  }

  private mockResult(input: PlatformPostInput): PublishResult {
    logger.info('Facebook mock publish', { mediaUrl: input.mediaUrl });
    return { platform: this.name, success: true, externalPostId: `mock_fb_${Date.now()}`, postedAt: new Date().toISOString() };
  }
}
