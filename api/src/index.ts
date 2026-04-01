import { serve } from '@hono/node-server';
import { createApp } from './app.js';
import { createSupabaseKeyLookup } from './supabase/key-lookup.js';

const port = 3002;

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const lookup = supabaseUrl && supabaseKey
  ? createSupabaseKeyLookup()
  : () => Promise.resolve(null);

const app = createApp(lookup);

serve({ fetch: app.fetch, port }, () => {
  const mode = supabaseUrl && supabaseKey ? 'supabase' : 'stub (no SUPABASE_URL)';
  console.log(`RelayKit API running on port ${port} [auth: ${mode}]`);
});
