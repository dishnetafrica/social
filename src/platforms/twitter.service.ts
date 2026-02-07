import { env } from '../config/env';
import { requestWithRetry } from '../utils/http';
import { logger } from '../utils/logger';
import { PlatformPostInput, PublishResult } from '../utils/types';
import { SocialPlatformService } from './platform.interface';

export class TwitterService implements SocialPlatformService {
  readonly name = 'twitter' as const;

  async publishPost(input: PlatformPostInput): Promise<PublishResult> {
    try {
      if (!env.TWITTER_BEARER_TOKEN) {
        return { platform: this.name, success: true, externalPostId: `mock_x_${Date.now()}`, postedAt: new Date().toISOString() };
      }
      const response = await requestWithRetry<{ data: { id: string } }>({
        method: 'POST',
        url: 'https://api.twitter.com/2/tweets',
        headers: { Authorization: `Bearer ${env.TWITTER_BEARER_TOKEN}` },
        data: { text: `${input.caption}\n${input.mediaUrl}` }
      });
      return { platform: this.name, success: true, externalPostId: response.data.id, postedAt: new Date().toISOString() };
    } catch (error) {
      logger.error('Twitter publish failed', { error });
      return { platform: this.name, success: false, error: (error as Error).message, postedAt: new Date().toISOString() };
    }
  }
}
