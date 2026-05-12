import { describe, it, expect, beforeAll } from 'vitest';
import { prepareApp } from '../helpers/app-test.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const notification = require('../../server/services/notification.service.js');
const { withConnection } = require('../../db/migration-runner.js');

describe('Events public API', () => {
  let availability, request;

  beforeAll(async () => {
    ({ availability, request } = await prepareApp());
  }, 30000);

  it('GET /api/v1/events lista eventos futuros con seats_left y few_seats_left', async () => {
    if (!availability.available) return;
    const res = await request.get('/api/v1/events');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBeGreaterThanOrEqual(2);
    for (const ev of res.body.items) {
      expect(typeof ev.seats_left).toBe('number');
      expect(typeof ev.few_seats_left).toBe('boolean');
      expect(typeof ev.is_full).toBe('boolean');
    }
  });

  it('GET /api/v1/events/:slug devuelve detalle del evento', async () => {
    if (!availability.available) return;
    const res = await request.get('/api/v1/events/cata-quesos-de-oveja');
    expect(res.status).toBe(200);
    expect(res.body.slug).toBe('cata-quesos-de-oveja');
    expect(typeof res.body.seats_left).toBe('number');
  });

  it('GET /api/v1/events/:slug 404 si no existe', async () => {
    if (!availability.available) return;
    const res = await request.get('/api/v1/events/no-existe');
    expect(res.status).toBe(404);
    expect(res.headers['content-type']).toMatch('application/problem+json');
  });

  it('POST reservation happy path crea reserva 201 y notifica', async () => {
    if (!availability.available) return;
    notification._drainSink();
    const res = await request
      .post('/api/v1/events/cata-quesos-de-oveja/reservations')
      .send({
        name: 'Maria Lopez',
        email: 'maria@example.test',
        phone: '+34 600 000 000',
        party_size: 2,
        notes: 'Sin gluten si es posible',
      });
    expect(res.status).toBe(201);
    expect(res.body.id).toBeDefined();
    expect(res.body.status).toBe('NEW');

    const sink = notification._drainSink();
    const reservedNotif = sink.find((s) => s.kind === 'new_event_reservation');
    expect(reservedNotif).toBeDefined();
  });

  it('POST reservation invalid payload devuelve 400 RFC 7807', async () => {
    if (!availability.available) return;
    const res = await request
      .post('/api/v1/events/cata-quesos-de-oveja/reservations')
      .send({ name: 'X', email: 'no-es-email', party_size: 99 });
    expect(res.status).toBe(400);
    expect(res.headers['content-type']).toMatch('application/problem+json');
    const fields = res.body.errors.map((e) => e.field);
    expect(fields).toContain('email');
    expect(fields).toContain('party_size');
  });

  it('POST reservation en evento lleno devuelve 422', async () => {
    if (!availability.available) return;
    // Llenamos artificialmente el evento taller-quesos-azules (capacity 10)
    // insertando una reserva con party_size = 10.
    await withConnection(async (c) => {
      const [ev] = await c.query("SELECT id FROM event WHERE slug = 'taller-quesos-azules'");
      await c.query(
        `INSERT INTO event_reservation (event_id, name, email, phone, party_size, status)
         VALUES (?, 'Lleno', 'lleno@example.test', '+34', ?, 'CONFIRMED')`,
        [Number(ev.id), 10],
      );
    }, { database: process.env.DB_NAME });

    const res = await request
      .post('/api/v1/events/taller-quesos-azules/reservations')
      .send({
        name: 'Pedro',
        email: 'pedro@example.test',
        phone: '+34 600 111 222',
        party_size: 1,
      });
    expect(res.status).toBe(422);
    expect(res.headers['content-type']).toMatch('application/problem+json');
    expect(res.body.code === 'EVENT_FULL' || (res.body.extra && res.body.extra.code === 'EVENT_FULL') || res.body.title === 'Unprocessable Entity').toBeTruthy();
  });
});
