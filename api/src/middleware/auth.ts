import { createHash } from 'node:crypto';
import type { MiddlewareHandler } from 'hono';
import type { ApiKeyRecord, AppVariables } from '../types.js';

export type KeyLookup = (keyHash: string) => Promise<ApiKeyRecord | null>;

const reject = { error: { code: 'invalid_api_key', message: 'Missing or invalid API key' } } as const;

export function hashApiKey(key: string): string {
  return createHash('sha256').update(key).digest('hex');
}

export function createAuthMiddleware(lookup: KeyLookup): MiddlewareHandler<{ Variables: AppVariables }> {
  return async (c, next) => {
    const header = c.req.header('Authorization');
    if (!header || !header.startsWith('Bearer ')) {
      return c.json(reject, 401);
    }

    const rawKey = header.slice(7);
    const keyHash = hashApiKey(rawKey);
    const record = await lookup(keyHash);

    if (!record || record.revoked_at !== null) {
      return c.json(reject, 401);
    }

    c.set('user_id', record.user_id ?? null);
    c.set('environment', record.environment);
    c.set('api_key_id', record.id);

    await next();
  };
}
