import OpenAI from 'openai';
import { env } from '../config/env';
import { CaptionRequest } from '../utils/types';

const platformRules: Record<CaptionRequest['platform'], string> = {
  facebook: 'Write a short paragraph with trust and community tone. Include CTA to WhatsApp.',
  instagram: 'Use simple English, 1-2 emojis, and 4-6 relevant hashtags.',
  linkedin: 'Professional but warm short paragraph with value and CTA.',
  twitter: 'Keep strictly under 280 characters including hashtags and CTA.',
  tiktok: 'Casual, very short, trend-friendly line with hashtags and CTA.',
  youtube: 'Create a strong hook in first sentence and CTA for WhatsApp inquiry.'
};

export class OpenAIService {
  private client = new OpenAI({ apiKey: env.OPENAI_API_KEY });

  async generateCaption(input: CaptionRequest): Promise<string> {
    const prompt = `Brand: DishNet Africa. Market: Africa. Offer: ${input.offer}. Theme: ${input.theme}. Platform: ${input.platform}. ${platformRules[input.platform]} Keep language simple and local.`;
    const response = await this.client.responses.create({
      model: env.OPENAI_MODEL,
      input: [
        { role: 'system', content: 'You create conversion-focused social media captions.' },
        { role: 'user', content: prompt }
      ],
      max_output_tokens: 180
    });
    return response.output_text.trim();
  }

  async detectCommentIntent(comment: string): Promise<'price' | 'availability' | 'contact' | 'other'> {
    const response = await this.client.responses.create({
      model: env.OPENAI_MODEL,
      input: `Classify intent from this comment in one word only [price, availability, contact, other]: ${comment}`,
      max_output_tokens: 10
    });
    const parsed = response.output_text.trim().toLowerCase();
    if (parsed.includes('price')) return 'price';
    if (parsed.includes('availability')) return 'availability';
    if (parsed.includes('contact')) return 'contact';
    return 'other';
  }
}
