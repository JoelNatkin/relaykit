import type { Context } from 'hono';
import type { AppVariables, ConsentStore } from '../types.js';

export function createConsentHandlers(store: ConsentStore) {
  async function handleRecord(c: Context<{ Variables: AppVariables }>) {
    let body: { phone?: string; source?: string };
    try {
      body = await c.req.json<{ phone?: string; source?: string }>();
    } catch {
      return c.json(
        { error: { code: 'invalid_data', message: 'Invalid or missing request body' } },
        400,
      );
    }

    const { phone, source } = body;
    if (!phone || !source) {
      const missing = [!phone && 'phone', !source && 'source'].filter(Boolean);
      return c.json(
        { error: { code: 'invalid_data', message: `Missing required fields: ${missing.join(', ')}` } },
        400,
      );
    }

    const userId = c.get('user_id');
    const ip = c.req.header('x-forwarded-for') ?? null;
    const record = await store.record(userId, phone, source, ip);

    return c.json({
      phone: record.phone,
      status: 'recorded',
      consented_at: record.consented_at,
    });
  }

  async function handleCheck(c: Context<{ Variables: AppVariables }>) {
    const phone = c.req.param('phone') as string;
    const userId = c.get('user_id');
    const record = await store.check(userId, phone);

    if (record) {
      return c.json({
        phone: record.phone,
        consented: true,
        consented_at: record.consented_at,
      });
    }

    return c.json({ phone, consented: false });
  }

  async function handleRevoke(c: Context<{ Variables: AppVariables }>) {
    const phone = c.req.param('phone') as string;
    const userId = c.get('user_id');
    const record = await store.revoke(userId, phone);

    if (!record) {
      return c.json({ phone, status: 'not_found' });
    }

    return c.json({
      phone: record.phone,
      status: 'revoked',
      revoked_at: record.revoked_at,
    });
  }

  return { handleRecord, handleCheck, handleRevoke };
}
