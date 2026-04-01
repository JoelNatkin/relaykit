import type { ClientOptions } from '../client.js';
import { sendMessage } from '../client.js';
import type { MarketingContentData, MarketingNamespace, SendResult } from '../types.js';

export function createMarketing(options: ClientOptions): MarketingNamespace {
  return {
    sendPromotion(phone: string, data: MarketingContentData): Promise<SendResult | null> {
      return sendMessage(options, 'marketing_weekly_promotion', phone, data as unknown as Record<string, unknown>);
    },
    sendNewArrivals(phone: string, data: MarketingContentData): Promise<SendResult | null> {
      return sendMessage(options, 'marketing_new_arrivals', phone, data as unknown as Record<string, unknown>);
    },
  };
}
