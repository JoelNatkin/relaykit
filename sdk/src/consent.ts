import type { ClientOptions } from './client.js';
import { consentRequest } from './client.js';
import type { ConsentRecord, RecordConsentParams } from './types.js';

/** Record SMS consent for a phone number. Call when a user checks the SMS consent checkbox. */
export function recordConsent(
  options: ClientOptions,
  params: RecordConsentParams,
): Promise<ConsentRecord | null> {
  return consentRequest(options, 'POST', '/consent', {
    phone: params.phone,
    consentType: params.consentType,
    source: params.source,
  });
}

/** Check if a phone number has active consent. */
export function checkConsent(
  options: ClientOptions,
  phone: string,
): Promise<ConsentRecord | null> {
  return consentRequest(options, 'GET', `/consent/${encodeURIComponent(phone)}`);
}

/** Revoke consent for a phone number. */
export function revokeConsent(
  options: ClientOptions,
  phone: string,
): Promise<ConsentRecord | null> {
  return consentRequest(options, 'DELETE', `/consent/${encodeURIComponent(phone)}`);
}
