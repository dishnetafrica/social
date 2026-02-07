import { Request, Response } from 'express';
import { OpenAIService } from '../services/openai.service';
import { PublishService } from '../services/publish.service';
import { CaptionRequest, PlatformPostInput } from '../utils/types';

const openAIService = new OpenAIService();
const publishService = new PublishService();

export async function generateCaption(req: Request, res: Response): Promise<void> {
  const payload = req.body as CaptionRequest;
  const caption = await openAIService.generateCaption(payload);
  res.json({ caption });
}

export async function publishToPlatform(req: Request, res: Response): Promise<void> {
  const payload = req.body as PlatformPostInput;
  const result = await publishService.publishPost(payload);
  res.json(result);
}

export async function publishMultiPlatform(req: Request, res: Response): Promise<void> {
  const payload = req.body as PlatformPostInput[];
  const result = await publishService.publishBatch(payload);
  res.json(result);
}
