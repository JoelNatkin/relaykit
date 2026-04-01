import { Hono } from 'hono';
import { createAuthMiddleware } from './middleware/auth.js';
import { handlePostMessages } from './routes/messages.js';
import type { ApiKeyRecord, AppVariables } from './types.js';

export type KeyLookup = (keyHash: string) => Promise<ApiKeyRecord | null>;

export function createApp(lookup: KeyLookup) {
  const app = new Hono<{ Variables: AppVariables }>();

  app.get('/', (c) => {
    return c.json({ status: 'ok', service: 'relaykit-api' });
  });

  const v1 = new Hono<{ Variables: AppVariables }>();
  v1.use('*', createAuthMiddleware(lookup));

  v1.post('/messages', handlePostMessages);

  app.route('/v1', v1);

  return app;
}

// Default app instance with a stub lookup for dev/health-check use
export const app = createApp(() => Promise.resolve(null));
