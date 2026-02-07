import { env } from '../config/env';

export class WhatsAppService {
  generateLeadLink(sourcePlatform: string, sourcePostId: string): string {
    const body = `${env.WHATSAPP_PREFILL_TEXT} Source: ${sourcePlatform} / ${sourcePostId}`;
    return `https://wa.me/${env.WHATSAPP_NUMBER}?text=${encodeURIComponent(body)}`;
  }

  buildAutoReply(sourcePlatform: string, sourcePostId: string): string {
    return `Thanks for your interest in DishNet Africa Fiber (up to 20 Mbps from $50/month). Chat with our sales team here: ${this.generateLeadLink(sourcePlatform, sourcePostId)}`;
  }
}
