import { describe, it, expect } from 'vitest';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const idempotency = require('../../server/services/idempotency.service.js');

describe('idempotency.service.hashPayload', () => {
  it('hashea de forma estable independiente del orden de claves', () => {
    const a = idempotency.hashPayload({ a: 1, b: { x: 'y', z: [1, 2, 3] } });
    const b = idempotency.hashPayload({ b: { z: [1, 2, 3], x: 'y' }, a: 1 });
    expect(a).toBe(b);
  });

  it('hashes diferentes para payloads distintos', () => {
    const a = idempotency.hashPayload({ qty: 1 });
    const b = idempotency.hashPayload({ qty: 2 });
    expect(a).not.toBe(b);
  });

  it('hash determinista 64 chars hex', () => {
    const h = idempotency.hashPayload({ foo: 'bar' });
    expect(h).toMatch(/^[a-f0-9]{64}$/);
  });
});

describe('idempotency.service.stableStringify', () => {
  it('serializa arrays preservando orden interno', () => {
    expect(idempotency.stableStringify([3, 1, 2])).toBe('[3,1,2]');
  });

  it('null y primitivos', () => {
    expect(idempotency.stableStringify(null)).toBe('null');
    expect(idempotency.stableStringify(true)).toBe('true');
    expect(idempotency.stableStringify(42)).toBe('42');
  });
});
