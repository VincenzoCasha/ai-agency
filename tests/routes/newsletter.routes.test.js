import { describe, it, expect, beforeAll } from 'vitest';
import { prepareApp } from '../helpers/app-test.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const newsletterService = require('../../server/services/newsletter.service.js');

describe('POST /api/v1/newsletter/subscribe', () => {
  let availability, request;

  beforeAll(async () => {
    ({ availability, request } = await prepareApp());
  }, 30000);

  it('subscribe nuevo email funciona con provider noop', async () => {
    if (!availability.available) return;
    expect(newsletterService._provider.name).toBe('noop');

    const res = await request.post('/api/v1/newsletter/subscribe').send({
      email: 'nueva.suscriptora@example.test',
      source: 'home',
    });
    expect(res.status).toBe(201);
    expect(res.body.status).toBe('ACTIVE');
    expect(res.body.created).toBe(true);
    expect(res.body.provider).toBe('noop');
  });

  it('reuse de email existente devuelve created=false', async () => {
    if (!availability.available) return;
    const res = await request.post('/api/v1/newsletter/subscribe').send({
      email: 'nueva.suscriptora@example.test',
      source: 'home',
    });
    expect(res.status).toBe(201);
    expect(res.body.created).toBe(false);
  });

  it('rechaza email invalido con 400 RFC 7807', async () => {
    if (!availability.available) return;
    const res = await request.post('/api/v1/newsletter/subscribe').send({
      email: 'no-es-email',
    });
    expect(res.status).toBe(400);
    expect(res.headers['content-type']).toMatch('application/problem+json');
  });
});
