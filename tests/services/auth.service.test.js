import { describe, it, expect } from 'vitest';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const jwt = require('jsonwebtoken');
const jwtService = require('../../server/services/jwt.service.js');

describe('jwt.service', () => {
  it('signAccessToken produce JWT verificable con audience/issuer', () => {
    const token = jwtService.signAccessToken({ adminId: 1, email: 'a@b.test', role: 'ADMIN' });
    const payload = jwtService.verifyAccessToken(token);
    expect(payload.sub).toBe('1');
    expect(payload.email).toBe('a@b.test');
    expect(payload.role).toBe('ADMIN');
    expect(payload.aud).toBe('crudo-admin');
  });

  it('verifyAccessToken rechaza token mal firmado', () => {
    const bad = jwt.sign({ sub: '1' }, 'wrong-secret');
    expect(() => jwtService.verifyAccessToken(bad)).toThrow();
  });

  it('hashRefreshToken produce 64 hex chars deterministicos', () => {
    const t = jwtService.signRefreshToken({ adminId: 1 });
    const h = jwtService.hashRefreshToken(t);
    expect(h).toMatch(/^[a-f0-9]{64}$/);
    expect(jwtService.hashRefreshToken(t)).toBe(h);
  });

  it('signRefreshToken produce tokens distintos por nonce', () => {
    const a = jwtService.signRefreshToken({ adminId: 1 });
    const b = jwtService.signRefreshToken({ adminId: 1 });
    expect(a).not.toBe(b);
  });
});
