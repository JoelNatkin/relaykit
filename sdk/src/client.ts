import { RelayKitError } from './errors.js';
import type { ConsentRecord, SendResult } from './types.js';

const RELAYKIT_API_URL = process.env.RELAYKIT_API_URL ?? 'https://api.relaykit.ai/v1';

export interface ClientOptions {
  apiKey: string | null;
  strict: boolean;
}

function warn(message: string): null {
  console.warn(`[RelayKit] ${message}`);
  return null;
}

/**
 * Send a message via POST /v1/messages.
 * Returns SendResult on success, structured failure on API error,
 * null + console.warn on validation/network error (or throws in strict mode).
 */
export async function sendMessage(
  options: ClientOptions,
  namespace: string,
  event: string,
  to: string,
  data: Record<string, unknown>,
): Promise<SendResult | null> {
  if (!to) {
    if (options.strict) throw new RelayKitError('No phone number provided.', 'MISSING_PHONE');
    return warn('No phone number provided — skipping message.');
  }
  if (!options.apiKey) {
    if (options.strict)
      throw new RelayKitError('RELAYKIT_API_KEY not set.', 'MISSING_API_KEY');
    return warn('RELAYKIT_API_KEY not set — skipping message.');
  }

  try {
    const response = await fetch(`${RELAYKIT_API_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${options.apiKey}`,
      },
      body: JSON.stringify({ namespace, event, to, data }),
    });

    if (!response.ok) {
      const err: { reason?: string } = await response.json().catch(() => ({}));
      const reason = err.reason ?? 'unknown';

      if (options.strict) {
        throw new RelayKitError(`Message failed (${response.status}): ${reason}`, 'SEND_FAILED');
      }

      console.warn(`[RelayKit] Message failed (${response.status}): ${reason}`);
      return { id: null, status: 'failed', reason };
    }

    return (await response.json()) as SendResult;
  } catch (err) {
    if (err instanceof RelayKitError) throw err;
    const message = err instanceof Error ? err.message : 'Unknown error';
    if (options.strict) throw new RelayKitError(`Network error: ${message}`, 'NETWORK_ERROR');
    return warn(`Network error: ${message}`);
  }
}

/**
 * Perform a consent operation against the /v1/consent endpoints.
 */
export async function consentRequest(
  options: ClientOptions,
  method: string,
  path: string,
  body?: Record<string, unknown>,
): Promise<ConsentRecord | null> {
  if (!options.apiKey) {
    if (options.strict)
      throw new RelayKitError('RELAYKIT_API_KEY not set.', 'MISSING_API_KEY');
    return warn('RELAYKIT_API_KEY not set — skipping consent operation.');
  }

  try {
    const init: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${options.apiKey}`,
      },
    };
    if (body) init.body = JSON.stringify(body);

    const response = await fetch(`${RELAYKIT_API_URL}${path}`, init);

    if (!response.ok) {
      const err: { reason?: string } = await response.json().catch(() => ({}));
      const reason = err.reason ?? 'unknown';

      if (options.strict) {
        throw new RelayKitError(
          `Consent operation failed (${response.status}): ${reason}`,
          'CONSENT_FAILED',
        );
      }

      console.warn(`[RelayKit] Consent operation failed (${response.status}): ${reason}`);
      return { phone: '', consentType: '', status: 'not_found' as const, reason };
    }

    return (await response.json()) as ConsentRecord;
  } catch (err) {
    if (err instanceof RelayKitError) throw err;
    const message = err instanceof Error ? err.message : 'Unknown error';
    if (options.strict) throw new RelayKitError(`Network error: ${message}`, 'NETWORK_ERROR');
    return warn(`Network error: ${message}`);
  }
}
