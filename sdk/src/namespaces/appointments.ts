import type { ClientOptions } from '../client.js';
import { sendMessage } from '../client.js';
import type {
  AppointmentCancellationData,
  AppointmentConfirmationData,
  AppointmentsNamespace,
  SendResult,
} from '../types.js';

export function createAppointments(options: ClientOptions): AppointmentsNamespace {
  return {
    sendConfirmation(phone: string, data: AppointmentConfirmationData): Promise<SendResult | null> {
      return sendMessage(options, 'appointments', 'sendConfirmation', phone, data as unknown as Record<string, unknown>);
    },
    sendReminder(phone: string, data: AppointmentConfirmationData): Promise<SendResult | null> {
      return sendMessage(options, 'appointments', 'sendReminder', phone, data as unknown as Record<string, unknown>);
    },
    sendReschedule(phone: string, data: AppointmentConfirmationData): Promise<SendResult | null> {
      return sendMessage(options, 'appointments', 'sendReschedule', phone, data as unknown as Record<string, unknown>);
    },
    sendCancellation(phone: string, data: AppointmentCancellationData): Promise<SendResult | null> {
      return sendMessage(options, 'appointments', 'sendCancellation', phone, data as unknown as Record<string, unknown>);
    },
    sendNoShow(phone: string, data: AppointmentCancellationData): Promise<SendResult | null> {
      return sendMessage(options, 'appointments', 'sendNoShow', phone, data as unknown as Record<string, unknown>);
    },
  };
}
