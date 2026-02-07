import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import { env } from './config/env';
import { handleCommentWebhook } from './api/comments.controller';
import { createPromoVideo, getPromoVideoStatus, processMedia } from './api/media.controller';
import { publishMultiPlatform, publishToPlatform, generateCaption } from './api/publish.controller';
import { getWeeklyReport } from './api/reports.controller';
import { logger } from './utils/logger';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '2mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', service: 'DishNet Africa Social Automation' });
});

app.post('/api/media/process', asyncHandler(processMedia));
app.post('/api/media/video-jobs', asyncHandler(createPromoVideo));
app.get('/api/media/video-jobs/:jobId', asyncHandler(getPromoVideoStatus));

app.post('/api/captions/generate', asyncHandler(generateCaption));
app.post('/api/publish', asyncHandler(publishToPlatform));
app.post('/api/publish/batch', asyncHandler(publishMultiPlatform));
app.post('/api/comments/webhook', asyncHandler(handleCommentWebhook));

app.get('/api/reports/weekly', asyncHandler(getWeeklyReport));

app.use((error: Error, _req: Request, res: Response, _next: NextFunction) => {
  logger.error('Unhandled request error', { error });
  res.status(500).json({ error: error.message });
});

app.listen(env.PORT, () => {
  logger.info(`Server listening on port ${env.PORT}`);
});

function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<void>
): (req: Request, res: Response, next: NextFunction) => void {
  return (req, res, next) => {
    fn(req, res, next).catch(next);
  };
}
