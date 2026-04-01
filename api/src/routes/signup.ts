import { randomBytes, randomUUID } from 'node:crypto';
import type { Context } from 'hono';
import { hashApiKey } from '../middleware/auth.js';
import { getSupabaseClient } from '../supabase/client.js';

export async function handlePostSignupSandbox(c: Context) {
  // Accept empty body — no user fields needed for sandbox key generation
  try {
    await c.req.json();
  } catch {
    return c.json(
      { error: { code: 'invalid_data', message: 'Invalid or missing request body' } },
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
    console.error('Sandbox signup insert failed:', error);
    return c.json(
      { error: { code: 'signup_failed', message: 'Failed to create sandbox API key' } },
      500,
    );
  }

  return c.json(
    {
      api_key: rawKey,
      environment: 'sandbox',
      message: 'Store this key securely. Sandbox keys are visible in your dashboard.',
    },
    201,
  );
}
