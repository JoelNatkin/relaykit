import { serve } from '@hono/node-server';
import { app } from './app.js';

const port = 3002;

serve({ fetch: app.fetch, port }, () => {
  console.log(`RelayKit API running on port ${port}`);
});
