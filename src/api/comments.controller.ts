import { Request, Response } from 'express';
import { OpenAIService } from '../services/openai.service';
import { PublishService } from '../services/publish.service';
import { WhatsAppService } from '../services/whatsapp.service';
import { DataStoreService } from '../services/data-store.service';
import { SupportedPlatform } from '../utils/types';

const openAIService = new OpenAIService();
const publishService = new PublishService();
const whatsappService = new WhatsAppService();
const dataStore = new DataStoreService();

export async function handleCommentWebhook(req: Request, res: Response): Promise<void> {
  const { platform, postId, commentId, commentText } = req.body as {
    platform: SupportedPlatform;
    postId: string;
    commentId: string;
    commentText: string;
  };

  const intent = await openAIService.detectCommentIntent(commentText);
  if (intent === 'other') {
    res.json({ action: 'manual_review', reason: 'intent_not_supported' });
    return;
  }

  const adapter = publishService.getAdapter(platform);
  const reply = whatsappService.buildAutoReply(platform, postId);
  if (!adapter.replyToComment) {
    res.json({ action: 'manual_review', reason: 'platform_api_restriction', reply });
    return;
  }

  await adapter.replyToComment(postId, commentId, reply);
  await dataStore.addLead({ platform, postId, timestamp: new Date().toISOString(), whatsappClicks: 1 });
  res.json({ action: 'auto_replied', intent, reply });
}
