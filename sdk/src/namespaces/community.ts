import type { ClientOptions } from '../client.js';
import { sendMessage } from '../client.js';
import type {
  CommunityEventData,
  CommunityGroupUpdateData,
  CommunityNamespace,
  CommunityRenewalData,
  SendResult,
} from '../types.js';

export function createCommunity(options: ClientOptions): CommunityNamespace {
  return {
    sendEventReminder(phone: string, data: CommunityEventData): Promise<SendResult | null> {
      return sendMessage(options, 'community', 'sendEventReminder', phone, data as unknown as Record<string, unknown>);
    },
    sendGroupUpdate(phone: string, data: CommunityGroupUpdateData): Promise<SendResult | null> {
      return sendMessage(options, 'community', 'sendGroupUpdate', phone, data as unknown as Record<string, unknown>);
    },
    sendRenewalNotice(phone: string, data: CommunityRenewalData): Promise<SendResult | null> {
      return sendMessage(options, 'community', 'sendRenewalNotice', phone, data as unknown as Record<string, unknown>);
    },
  };
}
