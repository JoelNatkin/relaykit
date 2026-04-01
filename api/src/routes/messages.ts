import { randomUUID } from 'node:crypto';
import type { Context } from 'hono';
import type { AppVariables } from '../types.js';
import { validateMessageRequest } from './shared.js';

export async function handlePostMessages(c: Context<{ Variables: AppVariables }>) {
  const result = await validateMessageRequest(c);
  if (!result.ok) return result.response;

  const { to, message } = result.value;
  const id = `msg_${randomUUID()}`;
  const timestamp = new Date().toISOString();

  // Stub: log the composed message. Real Sinch integration comes later.
  console.log(`[send] ${id} → ${to}: ${message}`);

  return c.json({ id, status: 'sent', timestamp });
}
