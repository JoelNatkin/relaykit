import { serve } from '@hono/node-server';
import { createApp } from './app.js';
import { createSupabaseKeyLookup } from './supabase/key-lookup.js';
import { createSupabaseConsentStore } from './supabase/consent-store.js';

const port = 3002;

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const hasSupabase = Boolean(supabaseUrl && supabaseKey);

const lookup = hasSupabase
  ? createSupabaseKeyLookup()
  : () => Promise.resolve(null);

const consentStore = hasSupabase
  ? createSupabaseConsentStore()
  : undefined;

const app = createApp(lookup, consentStore);

serve({ fetch: app.fetch, port }, () => {
  const mode = hasSupabase ? 'supabase' : 'stub (no SUPABASE_URL)';
  console.log(`RelayKit API running on port ${port} [auth: ${mode}]`);
});
