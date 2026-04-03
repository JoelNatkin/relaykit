import type { ClientOptions } from '../client.js';
import { sendMessage } from '../client.js';
import type {
  SendResult,
  SupportNamespace,
  SupportStatusUpdateData,
  SupportTicketData,
} from '../types.js';

export function createSupport(options: ClientOptions): SupportNamespace {
  return {
    sendTicketCreated(phone: string, data: SupportTicketData): Promise<SendResult | null> {
      return sendMessage(options, 'support', 'sendTicketCreated', phone, data as unknown as Record<string, unknown>);
    },
    sendStatusUpdate(phone: string, data: SupportStatusUpdateData): Promise<SendResult | null> {
      return sendMessage(options, 'support', 'sendStatusUpdate', phone, data as unknown as Record<string, unknown>);
    },
    sendResolution(phone: string, data: SupportTicketData): Promise<SendResult | null> {
      return sendMessage(options, 'support', 'sendResolution', phone, data as unknown as Record<string, unknown>);
    },
  };
}
