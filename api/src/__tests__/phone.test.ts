import { describe, it, expect } from 'vitest';
import { normalizePhone, isValidE164 } from '../utils/phone.js';

describe('normalizePhone', () => {
  it('passes through a valid E.164 number unchanged', () => {
    expect(normalizePhone('+15551234567')).toBe('+15551234567');
  });

  it('prepends +1 to a 10-digit US number', () => {
    expect(normalizePhone('5551234567')).toBe('+15551234567');
  });

  it('prepends + to an 11-digit number starting with 1', () => {
    expect(normalizePhone('15551234567')).toBe('+15551234567');
  });

  it('strips parentheses and spaces', () => {
    expect(normalizePhone('(555) 123-4567')).toBe('+15551234567');
  });

  it('strips dashes', () => {
    expect(normalizePhone('555-123-4567')).toBe('+15551234567');
  });

  it('throws on empty string', () => {
    expect(() => normalizePhone('')).toThrow();
  });

  it('throws on too-short input', () => {
    expect(() => normalizePhone('123')).toThrow();
  });

  it('throws on non-US international number', () => {
    expect(() => normalizePhone('+44')).toThrow();
  });
});

describe('isValidE164', () => {
  it('returns true for valid US E.164', () => {
    expect(isValidE164('+15551234567')).toBe(true);
  });

  it('returns false for missing +', () => {
    expect(isValidE164('15551234567')).toBe(false);
  });

  it('returns false for non-US', () => {
    expect(isValidE164('+441234567890')).toBe(false);
  });
});
