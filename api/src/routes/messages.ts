import { randomUUID } from 'node:crypto';
import type { Context } from 'hono';
import type { AppVariables } from '../types.js';
import { lookupTemplate, interpolate } from '../templates/lookup.js';

interface MessageBody {
  namespace?: string;
  event?: string;
  to?: string;
  data?: Record<string, string>;
}

export async function handlePostMessages(c: Context<{ Variables: AppVariables }>) {
  let body: MessageBody;
  try {
    body = await c.req.json<MessageBody>();
  } catch {
    return c.json(
      { error: { code: 'invalid_data', message: 'Invalid or missing request body' } },
      400,
    );
  }

  const { namespace, event, to, data } = body;

  if (!namespace || !event || !to || !data) {
    const missing = [
      !namespace && 'namespace',
      !event && 'event',
      !to && 'to',
      !data && 'data',
    ].filter(Boolean);
    return c.json(
      { error: { code: 'invalid_data', message: `Missing required fields: ${missing.join(', ')}` } },
      400,
    );
  }

  // Custom message escape hatch — placeholder
  if (namespace === 'custom' && event === 'send') {
    return c.json(
      { error: { code: 'template_not_found', message: 'Custom messages not yet supported' } },
      422,
    );
  }

  const template = lookupTemplate(namespace, event);
  if (!template) {
    return c.json(
      { error: { code: 'template_not_found', message: `No template found for ${namespace}.${event}` } },
      422,
    );
  }

  let message: string;
  try {
    message = interpolate(template.template, data);
  } catch (err) {
    const errMessage = err instanceof Error ? err.message : 'Unknown interpolation error';
    return c.json(
      { error: { code: 'invalid_data', message: errMessage } },
      422,
    );
  }

  const id = `msg_${randomUUID()}`;
  const timestamp = new Date().toISOString();

  // Stub: log the composed message. Real Sinch integration comes later.
  console.log(`[send] ${id} → ${to}: ${message}`);

  return c.json({ id, status: 'sent', timestamp });
}
