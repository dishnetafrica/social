import { Request, Response } from 'express';
import { ReportsService } from '../services/reports.service';

const reportsService = new ReportsService();

export async function getWeeklyReport(_: Request, res: Response): Promise<void> {
  const report = await reportsService.weeklySummary();
  res.json(report);
}
