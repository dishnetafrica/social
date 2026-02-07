import { PlatformPostInput } from '../utils/types';
import { PublishService } from './publish.service';

export class SchedulerService {
  constructor(private publishService = new PublishService()) {}

  scheduleAt(when: Date, payloads: PlatformPostInput[]): NodeJS.Timeout {
    const delay = Math.max(0, when.getTime() - Date.now());
    return setTimeout(async () => {
      await this.publishService.publishBatch(payloads);
    }, delay);
  }

  scheduleRecurring(interval: 'daily' | 'weekly', payloads: PlatformPostInput[]): NodeJS.Timeout {
    const ms = interval === 'daily' ? 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
    return setInterval(async () => {
      await this.publishService.publishBatch(payloads);
    }, ms);
  }
}
