import type { Context } from 'hono';
import type { AppVariables } from '../types.js';
import type { MessageContext } from '../pipeline/types.js';
import { runPipeline } from '../pipeline/run.js';
import { normalize } from '../pipeline/steps/normalize.js';
import { interpolateStep } from '../pipeline/steps/interpolate.js';
import { send } from '../pipeline/steps/send.js';
import { logDelivery } from '../pipeline/steps/log-delivery.js';

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

  const initialCtx: MessageContext = {
    userId: c.get('user_id'),
    environment: c.get('environment'),
    apiKeyId: c.get('api_key_id'),
    namespace,
    event,
    toPhone: to,
    data,
  };

  const result = await runPipeline(
    [normalize, interpolateStep, send, logDelivery],
    initialCtx,
  );

  if (result instanceof Response) return result;

  return c.json({
    id: result.messageId,
    status: result.status,
    timestamp: result.timestamp,
  });
}
