import { FacebookService } from '../platforms/facebook.service';
import { InstagramService } from '../platforms/instagram.service';
import { LinkedInService } from '../platforms/linkedin.service';
import { TikTokService } from '../platforms/tiktok.service';
import { TwitterService } from '../platforms/twitter.service';
import { YouTubeService } from '../platforms/youtube.service';
import { SocialPlatformService } from '../platforms/platform.interface';
import { logger } from '../utils/logger';
import { PlatformPostInput, PublishResult, SupportedPlatform } from '../utils/types';
import { DataStoreService } from './data-store.service';

export class PublishService {
  private adapters: Record<SupportedPlatform, SocialPlatformService>;

  constructor(private dataStore = new DataStoreService()) {
    this.adapters = {
      facebook: new FacebookService(),
      instagram: new InstagramService(),
      linkedin: new LinkedInService(),
      twitter: new TwitterService(),
      tiktok: new TikTokService(),
      youtube: new YouTubeService()
    };
  }

  async publishPost(input: PlatformPostInput): Promise<PublishResult> {
    const adapter = this.adapters[input.platform];
    const result = await adapter.publishPost(input);
    await this.dataStore.addPost(result);
    logger.info('Post published', result);
    return result;
  }

  async publishBatch(inputs: PlatformPostInput[]): Promise<PublishResult[]> {
    const output: PublishResult[] = [];
    for (const input of inputs) {
      output.push(await this.publishPost(input));
    }
    return output;
  }

  getAdapter(platform: SupportedPlatform): SocialPlatformService {
    return this.adapters[platform];
  }
}
