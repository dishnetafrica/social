import { PlatformPostInput, PublishResult } from '../utils/types';

export interface SocialPlatformService {
  readonly name: PlatformPostInput['platform'];
  publishPost(input: PlatformPostInput): Promise<PublishResult>;
  replyToComment?(externalPostId: string, commentId: string, replyText: string): Promise<void>;
  fetchEngagement?(externalPostId: string): Promise<{ likes: number; comments: number; shares: number }>;
}
