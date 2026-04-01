// api/src/supabase/key-lookup.ts
import { getSupabaseClient } from './client.js';
import type { ApiKeyRecord } from '../types.js';
import type { KeyLookup } from '../app.js';

export function createSupabaseKeyLookup(): KeyLookup {
  return async (keyHash: string): Promise<ApiKeyRecord | null> => {
    const supabase = getSupabaseClient();

    const { data, error } = await supabase
      .from('api_keys')
      .select('id, user_id, key_hash, key_prefix, environment, status, created_at, revoked_at, last_used_at, label')
      .eq('key_hash', keyHash)
      .eq('status', 'active')
      .single();

    if (error || !data) {
      return null;
    }

    // Fire-and-forget: update last_used_at timestamp
    supabase
      .from('api_keys')
      .update({ last_used_at: new Date().toISOString() })
      .eq('id', data.id)
      .then(() => {});

    return data as ApiKeyRecord;
  };
}
