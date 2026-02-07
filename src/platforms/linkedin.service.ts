import { env } from '../config/env';
import { requestWithRetry } from '../utils/http';
import { logger } from '../utils/logger';
import { PlatformPostInput, PublishResult } from '../utils/types';
import { SocialPlatformService } from './platform.interface';

export class LinkedInService implements SocialPlatformService {
  readonly name = 'linkedin' as const;

  async publishPost(input: PlatformPostInput): Promise<PublishResult> {
    try {
      if (!env.LINKEDIN_ACCESS_TOKEN || !env.LINKEDIN_ORGANIZATION_URN) {
        return { platform: this.name, success: true, externalPostId: `mock_li_${Date.now()}`, postedAt: new Date().toISOString() };
      }
      const response = await requestWithRetry<{ id: string }>({
        method: 'POST',
        url: 'https://api.linkedin.com/rest/posts',
        headers: {
          Authorization: `Bearer ${env.LINKEDIN_ACCESS_TOKEN}`,
          'LinkedIn-Version': '202405',
          'Content-Type': 'application/json'
        },
        data: {
          author: env.LINKEDIN_ORGANIZATION_URN,
          commentary: input.caption,
          visibility: 'PUBLIC',
          distribution: { feedDistribution: 'MAIN_FEED', targetEntities: [], thirdPartyDistributionChannels: [] },
          content: { media: { id: input.mediaUrl, title: 'DishNet Africa Offer' } },
          lifecycleState: 'PUBLISHED',
          isReshareDisabledByAuthor: false
        }
      });
      return { platform: this.name, success: true, externalPostId: response.id, postedAt: new Date().toISOString() };
    } catch (error) {
      logger.error('LinkedIn publish failed', { error });
      return { platform: this.name, success: false, error: (error as Error).message, postedAt: new Date().toISOString() };
    }
  }
}
