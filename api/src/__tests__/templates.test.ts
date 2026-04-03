import { describe, it, expect } from 'vitest';
import { registry } from '../templates/registry.js';
import { lookupTemplate, interpolate } from '../templates/lookup.js';

describe('template registry', () => {
  it('has all 8 namespaces', () => {
    const namespaces = Object.keys(registry);
    expect(namespaces).toHaveLength(8);
    expect(namespaces.sort()).toEqual([
      'appointments',
      'community',
      'internal',
      'marketing',
      'orders',
      'support',
      'verification',
      'waitlist',
    ]);
  });

  const expectedCounts: [string, number][] = [
    ['appointments', 5],
    ['orders', 5],
    ['verification', 3],
    ['support', 3],
    ['marketing', 3],
    ['internal', 3],
    ['community', 4],
    ['waitlist', 4],
  ];

  it.each(expectedCounts)(
    '%s namespace has %i templates',
    (namespace, count) => {
      expect(Object.keys(registry[namespace])).toHaveLength(count);
    },
  );
});

describe('lookupTemplate', () => {
  it('returns the correct template for a known namespace/event pair', () => {
    const tmpl = lookupTemplate('appointments', 'sendConfirmation');
    if (tmpl === null) {
      expect.fail('expected template to be found');
    }
    expect(tmpl.id).toBe('appointments_booking_confirmation');
    expect(tmpl.namespace).toBe('appointments');
    expect(tmpl.event).toBe('sendConfirmation');
    expect(tmpl.variables).toContain('date');
    expect(tmpl.variables).toContain('time');
  });

  it('returns null for unknown namespace', () => {
    expect(lookupTemplate('nonexistent', 'sendConfirmation')).toBeNull();
  });

  it('returns null for unknown event', () => {
    expect(lookupTemplate('appointments', 'sendNonexistent')).toBeNull();
  });
});

describe('interpolate', () => {
  it('replaces variables correctly', () => {
    const result = interpolate('Hello {name}, your code is {code}.', {
      name: 'Alice',
      code: '1234',
    });
    expect(result).toBe('Hello Alice, your code is 1234.');
  });

  it('throws when a required variable is missing', () => {
    expect(() =>
      interpolate('Hello {name}, your code is {code}.', { name: 'Alice' }),
    ).toThrow('code');
  });
});
