import { DataStoreService } from './data-store.service';

export class ReportsService {
  constructor(private dataStore = new DataStoreService()) {}

  async weeklySummary(): Promise<{
    postsPerPlatform: Record<string, number>;
    engagementByPlatform: Record<string, number>;
    topPerformingContent: string[];
    recommendations: string[];
  }> {
    const data = await this.dataStore.getStore();
    const postsPerPlatform: Record<string, number> = {};
    const engagementByPlatform: Record<string, number> = {};

    data.posts.forEach((p) => {
      postsPerPlatform[p.platform] = (postsPerPlatform[p.platform] ?? 0) + 1;
    });

    data.engagement.forEach((e) => {
      const score = e.likes + e.comments * 2 + e.shares * 3;
      engagementByPlatform[e.platform] = (engagementByPlatform[e.platform] ?? 0) + score;
    });

    const topPerformingContent = [...data.engagement]
      .sort((a, b) => b.likes + b.comments + b.shares - (a.likes + a.comments + a.shares))
      .slice(0, 5)
      .map((entry) => `${entry.platform}:${entry.postId}`);

    const recommendations = [
      'Increase short-form video volume on top-engagement platforms.',
      'Use price-led CTA posts during evening peak browsing hours.',
      'Reply to all pricing and contact comments within 30 minutes.'
    ];

    return { postsPerPlatform, engagementByPlatform, topPerformingContent, recommendations };
  }
}
