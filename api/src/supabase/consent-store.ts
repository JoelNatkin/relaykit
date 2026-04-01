import { getSupabaseClient } from './client.js';
import type { ConsentRecord, ConsentStore } from '../types.js';

export function createSupabaseConsentStore(): ConsentStore {
  return {
    async record(user_id, phone, source, ip_address) {
      const supabase = getSupabaseClient();

      const { data, error } = await supabase
        .from('consent')
        .upsert(
          {
            user_id,
            phone,
            source,
            ip_address,
            consented_at: new Date().toISOString(),
            revoked_at: null,
          },
          { onConflict: 'user_id,phone' },
        )
        .select()
        .single();

      if (error || !data) {
        throw new Error(`Failed to record consent: ${error?.message ?? 'no data returned'}`);
      }

      return data as ConsentRecord;
    },

    async check(user_id, phone) {
      const supabase = getSupabaseClient();

      const { data, error } = await supabase
        .from('consent')
        .select('id, user_id, phone, consented_at, revoked_at, ip_address, source')
        .eq('user_id', user_id)
        .eq('phone', phone)
        .is('revoked_at', null)
        .single();

      if (error || !data) {
        return null;
      }

      return data as ConsentRecord;
    },

    async revoke(user_id, phone) {
      const supabase = getSupabaseClient();

      const { data, error } = await supabase
        .from('consent')
        .update({ revoked_at: new Date().toISOString() })
        .eq('user_id', user_id)
        .eq('phone', phone)
        .is('revoked_at', null)
        .select()
        .single();

      if (error || !data) {
        return null;
      }

      return data as ConsentRecord;
    },
  };
}
