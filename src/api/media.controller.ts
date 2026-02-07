import { Request, Response } from 'express';
import { MediaService } from '../services/media.service';

const mediaService = new MediaService();

export async function processMedia(req: Request, res: Response): Promise<void> {
  const { filePath } = req.body as { filePath: string };
  const result = await mediaService.processImages(filePath);
  res.json(result);
}

export async function createPromoVideo(req: Request, res: Response): Promise<void> {
  const { imageUrl } = req.body as { imageUrl: string };
  const job = await mediaService.generateVerticalPromoVideo(imageUrl);
  res.status(202).json(job);
}

export async function getPromoVideoStatus(req: Request, res: Response): Promise<void> {
  const { jobId } = req.params;
  const status = await mediaService.pollVideoJob(jobId);
  res.json(status);
}
