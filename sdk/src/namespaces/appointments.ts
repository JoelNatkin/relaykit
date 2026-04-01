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
      return sendMessage(options, 'appointments_booking_confirmation', phone, data as unknown as Record<string, unknown>);
    },
    sendReminder(phone: string, data: AppointmentConfirmationData): Promise<SendResult | null> {
      return sendMessage(options, 'appointments_reminder_24hr', phone, data as unknown as Record<string, unknown>);
    },
    sendReschedule(phone: string, data: AppointmentConfirmationData): Promise<SendResult | null> {
      return sendMessage(options, 'appointments_reschedule_confirmation', phone, data as unknown as Record<string, unknown>);
    },
    sendCancellation(phone: string, data: AppointmentCancellationData): Promise<SendResult | null> {
      return sendMessage(options, 'appointments_cancellation', phone, data as unknown as Record<string, unknown>);
    },
    sendNoShow(phone: string, data: AppointmentCancellationData): Promise<SendResult | null> {
      return sendMessage(options, 'appointments_noshow_followup', phone, data as unknown as Record<string, unknown>);
    },
  };
}
