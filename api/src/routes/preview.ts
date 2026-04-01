import type { Context } from 'hono';
import type { AppVariables } from '../types.js';
import { validateMessageRequest } from './shared.js';

export async function handlePostPreview(c: Context<{ Variables: AppVariables }>) {
  const result = await validateMessageRequest(c);
  if (!result.ok) return result.response;

  const { namespace, event, template, message } = result.value;

  return c.json({
    valid: true,
    message,
    template_id: template.id,
    namespace,
    event,
  });
}
