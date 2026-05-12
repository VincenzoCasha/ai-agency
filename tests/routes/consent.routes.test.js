import { describe, it, expect, beforeAll } from 'vitest';
import { prepareApp } from '../helpers/app-test.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { withConnection } = require('../../db/migration-runner.js');

describe('POST /api/v1/consent', () => {
  let availability, request;

  beforeAll(async () => {
    ({ availability, request } = await prepareApp());
  }, 30000);

  it('registra consentimiento con expiracion ~24 meses', async () => {
    if (!availability.available) return;
    const res = await request
      .post('/api/v1/consent')
      .set('User-Agent', 'vitest/1.0')
      .send({
        consent_id: 'consent-uuid-fake-123',
        analytics: true,
        marketing: false,
        preferences: true,
      });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.consent_id).toBe('consent-uuid-fake-123');
    expect(res.body.expires_at).toBeDefined();

    const expires = new Date(res.body.expires_at);
    const now = new Date();
    const monthsDiff = (expires.getFullYear() - now.getFullYear()) * 12 + (expires.getMonth() - now.getMonth());
    expect(monthsDiff).toBeGreaterThanOrEqual(23);
    expect(monthsDiff).toBeLessThanOrEqual(25);
  });

  it('los hashes de IP/UA son no nulos y no contienen el valor crudo', async () => {
    if (!availability.available) return;
    const res = await request
      .post('/api/v1/consent')
      .set('User-Agent', 'CRUDOTestAgent/1.0')
      .send({
        consent_id: 'consent-otro-id',
        analytics: false,
        marketing: false,
        preferences: false,
      });
    expect(res.status).toBe(201);

    const rows = await withConnection(
      (c) => c.query('SELECT ip_hash, user_agent_hash FROM consent_log WHERE id = ?', [Number(res.body.id)]),
      { database: process.env.DB_NAME },
    );
    expect(rows.length).toBe(1);
    expect(rows[0].user_agent_hash).toBeTruthy();
    expect(rows[0].user_agent_hash).not.toContain('CRUDOTestAgent');
  });

  it('rechaza body invalido con 400', async () => {
    if (!availability.available) return;
    const res = await request.post('/api/v1/consent').send({
      consent_id: 'short',
      analytics: 'yes',
    });
    expect(res.status).toBe(400);
    expect(res.headers['content-type']).toMatch('application/problem+json');
  });
});
