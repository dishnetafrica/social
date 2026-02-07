import fs from 'node:fs/promises';
import path from 'node:path';
import { EngagementRecord, LeadRecord, PublishResult } from '../utils/types';

interface StoreShape {
  posts: PublishResult[];
  leads: LeadRecord[];
  engagement: EngagementRecord[];
}

const DATA_FILE = path.resolve(process.cwd(), 'data', 'automation-store.json');

export class DataStoreService {
  private async readStore(): Promise<StoreShape> {
    try {
      const data = await fs.readFile(DATA_FILE, 'utf-8');
      return JSON.parse(data) as StoreShape;
    } catch {
      const initial: StoreShape = { posts: [], leads: [], engagement: [] };
      await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
      await fs.writeFile(DATA_FILE, JSON.stringify(initial, null, 2));
      return initial;
    }
  }

  private async writeStore(store: StoreShape): Promise<void> {
    await fs.writeFile(DATA_FILE, JSON.stringify(store, null, 2));
  }

  async addPost(post: PublishResult): Promise<void> {
    const store = await this.readStore();
    store.posts.push(post);
    await this.writeStore(store);
  }

  async addLead(lead: LeadRecord): Promise<void> {
    const store = await this.readStore();
    store.leads.push(lead);
    await this.writeStore(store);
  }

  async addEngagement(record: EngagementRecord): Promise<void> {
    const store = await this.readStore();
    store.engagement.push(record);
    await this.writeStore(store);
  }

  async getStore(): Promise<StoreShape> {
    return this.readStore();
  }
}
