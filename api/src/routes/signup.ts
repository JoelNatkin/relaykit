import { randomBytes, randomUUID } from 'node:crypto';
import type { Context } from 'hono';
import { hashApiKey } from '../middleware/auth.js';
import { getSupabaseClient } from '../supabase/client.js';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const E164_RE = /^\+[1-9]\d{6,14}$/;

export async function handlePostSignupSandbox(c: Context) {
  let body: { email?: string; phone?: string };
  try {
    body = await c.req.json<{ email?: string; phone?: string }>();
  } catch {
    return c.json(
      { error: { code: 'invalid_data', message: 'Invalid or missing request body' } },
      400,
    );
  }

  const { email, phone } = body;

  if (!email) {
    return c.json(
      { error: { code: 'invalid_data', message: 'Missing required field: email' } },
      400,
    );
  }
  if (!EMAIL_RE.test(email)) {
    return c.json(
      { error: { code: 'invalid_data', message: 'Invalid email format' } },
      400,
    );
  }

  if (!phone) {
    return c.json(
      { error: { code: 'invalid_data', message: 'Missing required field: phone' } },
      400,
    );
  }
  if (!E164_RE.test(phone)) {
    return c.json(
      { error: { code: 'invalid_data', message: 'Invalid phone format — use E.164 (e.g. +15551234567)' } },
      400,
    );
  }

  const rawKey = `rk_sandbox_${randomBytes(16).toString('hex')}`;
  const keyHash = hashApiKey(rawKey);
  const keyPrefix = rawKey.slice(0, 12);
  const userId = randomUUID();

  const supabase = getSupabaseClient();
  const { error } = await supabase.from('api_keys').insert({
    user_id: userId,
    key_hash: keyHash,
    key_prefix: keyPrefix,
    environment: 'sandbox',
    raw_key: rawKey,
    status: 'active',
  });

  if (error) {
    return c.json(
      { error: { code: 'signup_failed', message: 'Failed to create sandbox API key' } },
      500,
    );
  }

  return c.json(
    {
      api_key: rawKey,
      environment: 'sandbox',
      message: "Store this key — you won't see it again in production, but sandbox keys are always visible in your dashboard.",
    },
    201,
  );
}
