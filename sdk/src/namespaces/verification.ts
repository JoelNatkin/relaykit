import type { ClientOptions } from '../client.js';
import { sendMessage } from '../client.js';
import type {
  SendResult,
  VerificationCodeData,
  VerificationNamespace,
  VerificationNewDeviceData,
} from '../types.js';

export function createVerification(options: ClientOptions): VerificationNamespace {
  return {
    sendCode(phone: string, data: VerificationCodeData): Promise<SendResult | null> {
      return sendMessage(options, 'verification_code', phone, data as unknown as Record<string, unknown>);
    },
    sendPasswordReset(phone: string, data: VerificationCodeData): Promise<SendResult | null> {
      return sendMessage(options, 'verification_password_reset', phone, data as unknown as Record<string, unknown>);
    },
    sendNewDevice(phone: string, data: VerificationNewDeviceData): Promise<SendResult | null> {
      return sendMessage(options, 'verification_new_device', phone, data as unknown as Record<string, unknown>);
    },
  };
}
