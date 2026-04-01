import type { Context } from 'hono';
import type { AppVariables } from '../types.js';
import type { MessageTemplate } from '../templates/registry.js';
import { lookupTemplate, interpolate } from '../templates/lookup.js';

export interface MessageBody {
  namespace?: string;
  event?: string;
  to?: string;
  data?: Record<string, string>;
}

export interface ValidatedMessage {
  namespace: string;
  event: string;
  to: string;
  data: Record<string, string>;
  template: MessageTemplate;
  message: string;
}

type ValidationResult =
  | { ok: true; value: ValidatedMessage }
  | { ok: false; response: Response };

export async function validateMessageRequest(
  c: Context<{ Variables: AppVariables }>,
): Promise<ValidationResult> {
  let body: MessageBody;
  try {
    body = await c.req.json<MessageBody>();
  } catch {
    return {
      ok: false,
      response: c.json(
        { error: { code: 'invalid_data', message: 'Invalid or missing request body' } },
        400,
      ),
    };
  }

  const { namespace, event, to, data } = body;

  if (!namespace || !event || !to || !data) {
    const missing = [
      !namespace && 'namespace',
      !event && 'event',
      !to && 'to',
      !data && 'data',
    ].filter(Boolean);
    return {
      ok: false,
      response: c.json(
        { error: { code: 'invalid_data', message: `Missing required fields: ${missing.join(', ')}` } },
        400,
      ),
    };
  }

  if (namespace === 'custom' && event === 'send') {
    return {
      ok: false,
      response: c.json(
        { error: { code: 'template_not_found', message: 'Custom messages not yet supported' } },
        422,
      ),
    };
  }

  const template = lookupTemplate(namespace, event);
  if (!template) {
    return {
      ok: false,
      response: c.json(
        { error: { code: 'template_not_found', message: `No template found for ${namespace}.${event}` } },
        422,
      ),
    };
  }

  let message: string;
  try {
    message = interpolate(template.template, data);
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'Unknown interpolation error';
    return {
      ok: false,
      response: c.json(
        { error: { code: 'invalid_data', message: errMessage } },
        422,
      ),
    };
  }

  return { ok: true, value: { namespace, event, to, data, template, message } };
}
