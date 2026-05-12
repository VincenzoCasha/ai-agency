import { describe, it, expect } from 'vitest';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const audit = require('../../server/services/audit.service.js');

describe('audit.service.sanitize', () => {
  it('redacta passwords/tokens', () => {
    const out = audit.sanitize({
      email: 'a@b.test',
      password: 'secret-123',
      access_token: 'tok',
      data: { refresh_token: 'rt', name: 'OK' },
    });
    expect(out.email).toBe('a@b.test');
    expect(out.password).toBe('[REDACTED]');
    expect(out.access_token).toBe('[REDACTED]');
    expect(out.data.refresh_token).toBe('[REDACTED]');
    expect(out.data.name).toBe('OK');
  });

  it('trunca strings demasiado largos', () => {
    const long = 'x'.repeat(2000);
    const out = audit.sanitize({ note: long });
    expect(out.note.length).toBeLessThanOrEqual(501);
    expect(out.note.endsWith('…')).toBe(true);
  });

  it('soporta arrays y null', () => {
    expect(audit.sanitize(null)).toBe(null);
    expect(audit.sanitize([{ password: 'p' }])).toEqual([{ password: '[REDACTED]' }]);
  });
});
