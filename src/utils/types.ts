export type SupportedPlatform = 'facebook' | 'instagram' | 'linkedin' | 'twitter' | 'tiktok' | 'youtube';

export interface CaptionRequest {
  offer: string;
  theme: 'speed' | 'price' | 'trust' | 'cta';
  platform: SupportedPlatform;
}

export interface PlatformPostInput {
  platform: SupportedPlatform;
  mediaUrl: string;
  caption: string;
  mediaType: 'image' | 'video';
}

export interface PublishResult {
  platform: SupportedPlatform;
  success: boolean;
  externalPostId?: string;
  error?: string;
  postedAt: string;
}

export interface LeadRecord {
  platform: SupportedPlatform;
  postId: string;
  timestamp: string;
  whatsappClicks: number;
}

export interface EngagementRecord {
  platform: SupportedPlatform;
  postId: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
}
