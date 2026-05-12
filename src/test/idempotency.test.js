import { describe, it, expect } from 'vitest';
import { generateIdempotencyKey, IDEMPOTENCY_HEADER } from '../lib/idempotency';

describe('idempotency', () => {
  it('exposes the standard header name', () => {
    expect(IDEMPOTENCY_HEADER).toBe('Idempotency-Key');
  });

  it('generates non-empty unique-ish keys', () => {
    const a = generateIdempotencyKey();
    const b = generateIdempotencyKey();
    expect(a).toBeTruthy();
    expect(b).toBeTruthy();
    expect(a).not.toBe(b);
    expect(typeof a).toBe('string');
    expect(a.length).toBeGreaterThanOrEqual(10);
  });
});
