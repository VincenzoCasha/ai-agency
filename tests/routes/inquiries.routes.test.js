import { describe, it, expect, beforeAll } from 'vitest';
import { prepareApp } from '../helpers/app-test.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const notification = require('../../server/services/notification.service.js');

describe('POST /api/v1/inquiries', () => {
  let availability, request;

  beforeAll(async () => {
    ({ availability, request } = await prepareApp());
  }, 30000);

  it('CONTACT happy path crea inquiry y notifica', async () => {
    if (!availability.available) return;
    notification._drainSink();
    const res = await request.post('/api/v1/inquiries').send({
      type: 'CONTACT',
      name: 'Cliente Curioso',
      email: 'curioso@example.test',
      phone: '+34 600 123 456',
      message: 'Hola, querria saber mas sobre los quesos de temporada',
    });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.status).toBe('NEW');

    const sink = notification._drainSink();
    expect(sink.some((s) => s.kind === 'new_inquiry')).toBe(true);
  });

  it('WHOLESALE happy path con payload', async () => {
    if (!availability.available) return;
    const res = await request.post('/api/v1/inquiries').send({
      type: 'WHOLESALE',
      name: 'Restaurante X',
      email: 'comercial@restaurante.test',
      phone: '+34 911 000 000',
      message: 'Buscamos proveedor de quesos para carta semanal',
      payload: { vat_id: 'B-99999999', city: 'Madrid' },
    });
    expect(res.status).toBe(201);
  });

  it('rechaza tipo PICKUP con 400 (enum publico)', async () => {
    if (!availability.available) return;
    const res = await request.post('/api/v1/inquiries').send({
      type: 'PICKUP',
      name: 'X',
      email: 'x@example.test',
      message: 'test',
    });
    expect(res.status).toBe(400);
    expect(res.headers['content-type']).toMatch('application/problem+json');
  });

  it('rechaza body invalido con detalles RFC 7807', async () => {
    if (!availability.available) return;
    const res = await request.post('/api/v1/inquiries').send({
      type: 'CONTACT',
      email: 'no-es-email',
    });
    expect(res.status).toBe(400);
    const fields = res.body.errors.map((e) => e.field);
    expect(fields).toContain('name');
    expect(fields).toContain('message');
    expect(fields).toContain('email');
  });
});
