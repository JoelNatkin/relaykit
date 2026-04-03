import type { ClientOptions } from '../client.js';
import { sendMessage } from '../client.js';
import type {
  SendResult,
  WaitlistNamespace,
  WaitlistReservationData,
  WaitlistSpotData,
  WaitlistWaitTimeData,
} from '../types.js';

export function createWaitlist(options: ClientOptions): WaitlistNamespace {
  return {
    sendSpotAvailable(phone: string, data: WaitlistSpotData): Promise<SendResult | null> {
      return sendMessage(options, 'waitlist', 'sendSpotAvailable', phone, data as unknown as Record<string, unknown>);
    },
    sendReservationConfirmed(
      phone: string,
      data: WaitlistReservationData,
    ): Promise<SendResult | null> {
      return sendMessage(options, 'waitlist', 'sendReservationConfirmed', phone, data as unknown as Record<string, unknown>);
    },
    sendWaitTimeUpdate(phone: string, data: WaitlistWaitTimeData): Promise<SendResult | null> {
      return sendMessage(options, 'waitlist', 'sendWaitTimeUpdate', phone, data as unknown as Record<string, unknown>);
    },
  };
}
