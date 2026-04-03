import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { RelayKit, RelayKitError } from '../index.js';
import type { SendParams } from '../index.js';

// ── Global fetch mock ───────────────────────────────────────────────
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

beforeEach(() => {
  mockFetch.mockReset();
  delete process.env.RELAYKIT_API_KEY;
});

afterEach(() => {
  delete process.env.RELAYKIT_API_KEY;
});

// ── Core initialization ─────────────────────────────────────────────

describe('Core initialization', () => {
  it('creates instance with all 8 namespaces', () => {
    const rk = new RelayKit({ apiKey: 'k' });
    expect(rk.appointments).toBeDefined();
    expect(rk.orders).toBeDefined();
    expect(rk.verification).toBeDefined();
    expect(rk.support).toBeDefined();
    expect(rk.marketing).toBeDefined();
    expect(rk.internal).toBeDefined();
    expect(rk.community).toBeDefined();
    expect(rk.waitlist).toBeDefined();
  });

  it('without env var sets apiKey to null (graceful warn on send)', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const rk = new RelayKit();
    const result = await rk.appointments.sendConfirmation('+1555', {
      date: '2026-04-01',
      time: '10:00',
    });
    expect(result).toBeNull();
    expect(warn).toHaveBeenCalled();
    warn.mockRestore();
  });

  it('uses provided apiKey', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'msg_1', status: 'sent' }),
    });
    const rk = new RelayKit({ apiKey: 'test-key' });
    const result = await rk.appointments.sendConfirmation('+1555', {
      date: '2026-04-01',
      time: '10:00',
    });
    expect(result).toEqual({ id: 'msg_1', status: 'sent' });
    expect(mockFetch).toHaveBeenCalledOnce();
    const [, init] = mockFetch.mock.calls[0];
    expect(init.headers.Authorization).toBe('Bearer test-key');
  });

  it('enables strict mode via config', () => {
    const rk = new RelayKit({ apiKey: 'k', strict: true });
    // strict mode means errors throw — verified in strict mode tests below
    expect(rk).toBeInstanceOf(RelayKit);
  });
});

// ── Graceful failure (default mode) ─────────────────────────────────

describe('Graceful failure (default mode)', () => {
  it('sendConfirmation with no API key returns null and logs warning', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const rk = new RelayKit();
    const result = await rk.appointments.sendConfirmation('+1555', {
      date: '2026-04-01',
      time: '10:00',
    });
    expect(result).toBeNull();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('RELAYKIT_API_KEY'));
    expect(mockFetch).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it('sendConfirmation with empty phone returns null and logs warning', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const rk = new RelayKit({ apiKey: 'test-key' });
    const result = await rk.appointments.sendConfirmation('', {
      date: '2026-04-01',
      time: '10:00',
    });
    expect(result).toBeNull();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('phone'));
    expect(mockFetch).not.toHaveBeenCalled();
    warn.mockRestore();
  });

  it('send() with no API key returns null and logs warning', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const rk = new RelayKit();
    const result = await rk.send({
      to: '+1555',
      namespace: 'custom',
      event: 'send',
      data: { foo: 'bar' },
    });
    expect(result).toBeNull();
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('RELAYKIT_API_KEY'));
    warn.mockRestore();
  });
});

// ── Strict mode ─────────────────────────────────────────────────────

describe('Strict mode', () => {
  it('sendConfirmation with no API key throws RelayKitError with code MISSING_API_KEY', async () => {
    const rk = new RelayKit({ strict: true });
    await expect(
      rk.appointments.sendConfirmation('+1555', { date: '2026-04-01', time: '10:00' }),
    ).rejects.toThrow(RelayKitError);

    try {
      await rk.appointments.sendConfirmation('+1555', { date: '2026-04-01', time: '10:00' });
    } catch (err) {
      expect(err).toBeInstanceOf(RelayKitError);
      expect((err as RelayKitError).code).toBe('MISSING_API_KEY');
    }
  });

  it('sendConfirmation with empty phone throws RelayKitError with code MISSING_PHONE', async () => {
    const rk = new RelayKit({ apiKey: 'test-key', strict: true });
    await expect(
      rk.appointments.sendConfirmation('', { date: '2026-04-01', time: '10:00' }),
    ).rejects.toThrow(RelayKitError);

    try {
      await rk.appointments.sendConfirmation('', { date: '2026-04-01', time: '10:00' });
    } catch (err) {
      expect(err).toBeInstanceOf(RelayKitError);
      expect((err as RelayKitError).code).toBe('MISSING_PHONE');
    }
  });

  it('send() with no API key throws RelayKitError', async () => {
    const rk = new RelayKit({ strict: true });
    await expect(
      rk.send({ to: '+1555', namespace: 'custom', event: 'send', data: {} }),
    ).rejects.toThrow(RelayKitError);
  });
});

// ── Namespace structure ─────────────────────────────────────────────

describe('Namespace structure', () => {
  const rk = new RelayKit({ apiKey: 'k' });

  const namespaceMethods: [string, object, number][] = [
    ['appointments', rk.appointments, 5],
    ['orders', rk.orders, 5],
    ['verification', rk.verification, 3],
    ['support', rk.support, 3],
    ['marketing', rk.marketing, 3],
    ['internal', rk.internal, 3],
    ['community', rk.community, 4],
    ['waitlist', rk.waitlist, 4],
  ];

  it.each(namespaceMethods)(
    '%s namespace has %i methods',
    (name, namespace, expectedCount) => {
      const methods = Object.keys(namespace).filter(
        (k) => typeof (namespace as Record<string, unknown>)[k] === 'function',
      );
      expect(methods).toHaveLength(expectedCount);
    },
  );

  it('send() escape hatch exists and accepts SendParams shape', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'msg_2', status: 'queued' }),
    });
    const params: SendParams = {
      namespace: 'custom',
      event: 'sendNotification',
      to: '+15551234567',
      data: { content: 'Hello' },
    };
    const result = await rk.send(params);
    expect(result).toEqual({ id: 'msg_2', status: 'queued' });
  });
});

// ── Type contracts (compile-time verification) ──────────────────────

describe('Type contracts (compile-time)', () => {
  const rk = new RelayKit({ apiKey: 'k' });

  it('sendConfirmation accepts { date, time }', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'msg_3', status: 'sent' }),
    });
    const result = await rk.appointments.sendConfirmation('+1555', {
      date: '2026-04-01',
      time: '10:00',
    });
    expect(result).toBeDefined();
  });

  it('sendCancellation accepts { date }', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'msg_4', status: 'sent' }),
    });
    const result = await rk.appointments.sendCancellation('+1555', {
      date: '2026-04-01',
    });
    expect(result).toBeDefined();
  });

  it('send() accepts { namespace, event, to, data: Record<string, unknown> }', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 'msg_5', status: 'sent' }),
    });
    const result = await rk.send({
      namespace: 'test',
      event: 'sendTest',
      to: '+1555',
      data: { key: 'value', nested: { a: 1 } },
    });
    expect(result).toBeDefined();
  });
});
