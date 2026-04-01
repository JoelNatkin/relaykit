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
      return sendMessage(options, 'waitlist_spot_available', phone, data as unknown as Record<string, unknown>);
    },
    sendReservationConfirmed(
      phone: string,
      data: WaitlistReservationData,
    ): Promise<SendResult | null> {
      return sendMessage(options, 'waitlist_reservation_confirmation', phone, data as unknown as Record<string, unknown>);
    },
    sendWaitTimeUpdate(phone: string, data: WaitlistWaitTimeData): Promise<SendResult | null> {
      return sendMessage(options, 'waitlist_wait_time_update', phone, data as unknown as Record<string, unknown>);
    },
  };
}
