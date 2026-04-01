import { Hono } from 'hono';
import { createAuthMiddleware } from './middleware/auth.js';
import { createConsentHandlers } from './routes/consent.js';
import { handlePostMessages } from './routes/messages.js';
import { handlePostPreview } from './routes/preview.js';
import type { ApiKeyRecord, AppVariables, ConsentStore } from './types.js';

export type KeyLookup = (keyHash: string) => Promise<ApiKeyRecord | null>;

export function createApp(lookup: KeyLookup, consentStore?: ConsentStore) {
  const app = new Hono<{ Variables: AppVariables }>();

  app.get('/', (c) => {
    return c.json({ status: 'ok', service: 'relaykit-api' });
  });

  const v1 = new Hono<{ Variables: AppVariables }>();
  v1.use('*', createAuthMiddleware(lookup));

  v1.post('/messages', handlePostMessages);
  v1.post('/messages/preview', handlePostPreview);

  if (consentStore) {
    const consent = createConsentHandlers(consentStore);
    v1.post('/consent', consent.handleRecord);
    v1.get('/consent/:phone', consent.handleCheck);
    v1.delete('/consent/:phone', consent.handleRevoke);
  }

  app.route('/v1', v1);

  return app;
}

// Default app instance with a stub lookup for dev/health-check use
export const app = createApp(() => Promise.resolve(null));
