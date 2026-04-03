import type { ClientOptions } from '../client.js';
import { sendMessage } from '../client.js';
import type {
  InternalMeetingData,
  InternalNamespace,
  InternalScheduleChangeData,
  InternalShiftData,
  SendResult,
} from '../types.js';

export function createInternal(options: ClientOptions): InternalNamespace {
  return {
    sendMeetingReminder(phone: string, data: InternalMeetingData): Promise<SendResult | null> {
      return sendMessage(options, 'internal', 'sendMeetingReminder', phone, data as unknown as Record<string, unknown>);
    },
    sendScheduleChange(
      phone: string,
      data: InternalScheduleChangeData,
    ): Promise<SendResult | null> {
      return sendMessage(options, 'internal', 'sendScheduleChange', phone, data as unknown as Record<string, unknown>);
    },
    sendShiftConfirmation(phone: string, data: InternalShiftData): Promise<SendResult | null> {
      return sendMessage(options, 'internal', 'sendShiftConfirmation', phone, data as unknown as Record<string, unknown>);
    },
  };
}
