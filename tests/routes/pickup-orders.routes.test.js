import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { prepareApp } from '../helpers/app-test.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const notification = require('../../server/services/notification.service.js');
const { withConnection } = require('../../db/migration-runner.js');

function pickFutureDate(daysAhead = 2) {
  const d = new Date(Date.now() + daysAhead * 24 * 60 * 60 * 1000);
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

describe('POST /api/v1/pickup-orders', () => {
  let availability, request;

  beforeAll(async () => {
    ({ availability, request } = await prepareApp());
  }, 30000);

  beforeEach(() => {
    notification._drainSink();
  });

  it('happy path: 2 productos no alcoholicos -> 201 con total calculado en server, items, mensaje pago en tienda y WhatsApp <24h', async () => {
    if (!availability.available) return;
    const res = await request
      .post('/api/v1/pickup-orders')
      .send({
        name: 'Maria Pickup',
        email: 'maria@example.test',
        phone: '+34 600 555 111',
        pickup_date: pickFutureDate(2),
        pickup_slot: '18:00',
        notes: 'Sin gluten si es posible',
        items: [
          { product_slug: 'manchego-curado-12m', qty: 1 },
          { product_slug: 'queso-tetilla', qty: 2 },
        ],
      });
    expect(res.status).toBe(201);
    expect(res.body.order_id).toBeTypeOf('number');
    expect(res.body.status).toBe('NEW');
    expect(res.body.currency).toBe('EUR');
    expect(res.body.total_cents).toBe(1850 + 1200 * 2);
    expect(res.body.items).toHaveLength(2);
    expect(res.body.confirmation_message).toMatch(/CRUDO al recoger/);
    expect(res.body.confirmation_message).toMatch(/WhatsApp/);
    expect(res.body.confirmation_message).toMatch(/24 horas/);

    // Notificacion despues del commit
    const sink = notification._drainSink();
    const notif = sink.find((s) => s.kind === 'new_pickup_order');
    expect(notif).toBeDefined();
    expect(notif.payload.id).toBe(res.body.order_id);

    // Persistencia
    const rows = await withConnection(
      (c) => c.query('SELECT id, total_cents, status FROM pickup_order WHERE id = ?', [res.body.order_id]),
      { database: process.env.DB_NAME },
    );
    expect(rows.length).toBe(1);
    expect(Number(rows[0].total_cents)).toBe(1850 + 1200 * 2);
    expect(rows[0].status).toBe('NEW');
  });

  it('alcohol guard: producto vino is_alcohol=true -> 422 RFC 7807 con invalid_items', async () => {
    if (!availability.available) return;
    const res = await request.post('/api/v1/pickup-orders').send({
      name: 'Pedro',
      email: 'pedro@example.test',
      phone: '+34 600 000 000',
      pickup_date: pickFutureDate(2),
      pickup_slot: '18:00',
      items: [{ product_slug: 'vino-tinto-ribera-crianza', qty: 1 }],
    });
    expect(res.status).toBe(422);
    expect(res.headers['content-type']).toMatch('application/problem+json');
    expect(res.body.code).toBe('ALCOHOL_NOT_ALLOWED_IN_PICKUP');
    expect(res.body.invalid_items).toBeDefined();
    expect(res.body.invalid_items[0].product_slug).toBe('vino-tinto-ribera-crianza');
  });

  it('mixed cart (queso + vino) -> 422 y no persiste pedido', async () => {
    if (!availability.available) return;
    const beforeRows = await withConnection(
      (c) => c.query('SELECT COUNT(*) AS n FROM pickup_order'),
      { database: process.env.DB_NAME },
    );
    const before = Number(beforeRows[0].n);

    const res = await request.post('/api/v1/pickup-orders').send({
      name: 'Mezclado',
      email: 'mezcla@example.test',
      phone: '+34 600 999 999',
      pickup_date: pickFutureDate(2),
      pickup_slot: '18:00',
      items: [
        { product_slug: 'manchego-curado-12m', qty: 1 },
        { product_slug: 'vino-blanco-albarino', qty: 1 },
      ],
    });
    expect(res.status).toBe(422);
    expect(res.body.code).toBe('ALCOHOL_NOT_ALLOWED_IN_PICKUP');

    const afterRows = await withConnection(
      (c) => c.query('SELECT COUNT(*) AS n FROM pickup_order'),
      { database: process.env.DB_NAME },
    );
    expect(Number(afterRows[0].n)).toBe(before);
  });

  it('tabla con variante CON vino -> 422 (variant.is_alcohol=true)', async () => {
    if (!availability.available) return;
    const res = await request.post('/api/v1/pickup-orders').send({
      name: 'Tabla con vino',
      email: 'vinotabla@example.test',
      phone: '+34 600 111 222',
      pickup_date: pickFutureDate(2),
      pickup_slot: '18:00',
      items: [{ product_slug: 'tabla-3-quesos', variant_slug: 'tabla-3-con-tinto', qty: 1 }],
    });
    expect(res.status).toBe(422);
    expect(res.body.code).toBe('ALCOHOL_NOT_ALLOWED_IN_PICKUP');
  });

  it('tabla SIN vino (variante limpia) -> 201 con precio de la variante', async () => {
    if (!availability.available) return;
    const res = await request.post('/api/v1/pickup-orders').send({
      name: 'Tabla sin vino',
      email: 'tabla.ok@example.test',
      phone: '+34 600 111 333',
      pickup_date: pickFutureDate(2),
      pickup_slot: '18:30',
      items: [{ product_slug: 'tabla-3-quesos', variant_slug: 'tabla-3-sin-vino', qty: 1 }],
    });
    expect(res.status).toBe(201);
    expect(res.body.total_cents).toBe(1800);
    expect(res.body.items[0].variant_slug).toBe('tabla-3-sin-vino');
  });

  it('cliente no puede enviar precios -> 422 CLIENT_PRICES_NOT_ALLOWED', async () => {
    if (!availability.available) return;
    const res = await request.post('/api/v1/pickup-orders').send({
      name: 'Hacker',
      email: 'h@example.test',
      phone: '+34 600 000 001',
      pickup_date: pickFutureDate(2),
      pickup_slot: '18:00',
      total_cents: 1,
      items: [{ product_slug: 'manchego-curado-12m', qty: 1, unit_price_cents: 1 }],
    });
    expect(res.status).toBe(422);
    expect(res.body.code).toBe('CLIENT_PRICES_NOT_ALLOWED');
    expect(res.body.offenders).toEqual(expect.arrayContaining(['body.total_cents']));
  });

  it('items vacios -> 400 (validacion centralizada por min:1)', async () => {
    if (!availability.available) return;
    const res = await request.post('/api/v1/pickup-orders').send({
      name: 'Vacio',
      email: 'v@example.test',
      phone: '+34 600 000 002',
      pickup_date: pickFutureDate(2),
      pickup_slot: '18:00',
      items: [],
    });
    expect(res.status).toBe(400);
    expect(res.headers['content-type']).toMatch('application/problem+json');
  });

  it('qty invalida -> 400 con detalles items[].qty', async () => {
    if (!availability.available) return;
    const res = await request.post('/api/v1/pickup-orders').send({
      name: 'Qty',
      email: 'q@example.test',
      phone: '+34 600 000 003',
      pickup_date: pickFutureDate(2),
      pickup_slot: '18:00',
      items: [{ product_slug: 'manchego-curado-12m', qty: 0 }],
    });
    expect(res.status).toBe(400);
    expect(res.body.errors.some((e) => e.field === 'items[0].qty')).toBe(true);
  });

  it('producto inexistente -> 404 RFC 7807 con invalid_items', async () => {
    if (!availability.available) return;
    const res = await request.post('/api/v1/pickup-orders').send({
      name: 'Fantasma',
      email: 'f@example.test',
      phone: '+34 600 000 004',
      pickup_date: pickFutureDate(2),
      pickup_slot: '18:00',
      items: [{ product_slug: 'producto-fantasma', qty: 1 }],
    });
    expect(res.status).toBe(404);
    expect(res.body.code).toBe('PRODUCT_NOT_FOUND');
    expect(res.body.invalid_items[0].product_slug).toBe('producto-fantasma');
  });

  it('producto OUT -> 422 PRODUCT_OUT_OF_STOCK', async () => {
    if (!availability.available) return;
    await withConnection(
      (c) => c.query("UPDATE product SET stock_status='OUT' WHERE slug='pan-artesano'"),
      { database: process.env.DB_NAME },
    );
    const res = await request.post('/api/v1/pickup-orders').send({
      name: 'Sin stock',
      email: 'so@example.test',
      phone: '+34 600 000 005',
      pickup_date: pickFutureDate(2),
      pickup_slot: '18:00',
      items: [{ product_slug: 'pan-artesano', qty: 1 }],
    });
    expect(res.status).toBe(422);
    expect(res.body.code).toBe('PRODUCT_OUT_OF_STOCK');

    // Reset stock
    await withConnection(
      (c) => c.query("UPDATE product SET stock_status='IN_STOCK' WHERE slug='pan-artesano'"),
      { database: process.env.DB_NAME },
    );
  });

  it('fecha pasada -> 422 PICKUP_DATE_PAST', async () => {
    if (!availability.available) return;
    const res = await request.post('/api/v1/pickup-orders').send({
      name: 'Pasado',
      email: 'p@example.test',
      phone: '+34 600 000 006',
      pickup_date: '2020-01-01',
      pickup_slot: '18:00',
      items: [{ product_slug: 'manchego-curado-12m', qty: 1 }],
    });
    expect(res.status).toBe(422);
    expect(res.body.code).toBe('PICKUP_DATE_PAST');
  });

  it('slot mal formado -> 422 INVALID_SLOT_FORMAT', async () => {
    if (!availability.available) return;
    const res = await request.post('/api/v1/pickup-orders').send({
      name: 'Slot',
      email: 's@example.test',
      phone: '+34 600 000 007',
      pickup_date: pickFutureDate(2),
      pickup_slot: '18:15',
      items: [{ product_slug: 'manchego-curado-12m', qty: 1 }],
    });
    expect(res.status).toBe(422);
    expect(res.body.code).toBe('INVALID_SLOT_FORMAT');
  });

  it('slot fuera de horario -> 422 PICKUP_SLOT_OUT_OF_HOURS', async () => {
    if (!availability.available) return;
    const res = await request.post('/api/v1/pickup-orders').send({
      name: 'Tempran',
      email: 't@example.test',
      phone: '+34 600 000 008',
      pickup_date: pickFutureDate(2),
      pickup_slot: '08:00',
      items: [{ product_slug: 'manchego-curado-12m', qty: 1 }],
    });
    expect(res.status).toBe(422);
    expect(res.body.code).toBe('PICKUP_SLOT_OUT_OF_HOURS');
  });

  it('idempotency: misma key + mismo payload retorna mismo response sin duplicar', async () => {
    if (!availability.available) return;
    const key = `idem-test-${Date.now()}`;
    const payload = {
      name: 'Idempotente',
      email: 'idem@example.test',
      phone: '+34 600 000 009',
      pickup_date: pickFutureDate(2),
      pickup_slot: '18:00',
      items: [{ product_slug: 'queso-tetilla', qty: 1 }],
    };
    const first = await request
      .post('/api/v1/pickup-orders')
      .set('Idempotency-Key', key)
      .send(payload);
    expect(first.status).toBe(201);

    const second = await request
      .post('/api/v1/pickup-orders')
      .set('Idempotency-Key', key)
      .send(payload);
    expect(second.status).toBe(201);
    expect(second.body.order_id).toBe(first.body.order_id);

    const rows = await withConnection(
      (c) => c.query('SELECT COUNT(*) AS n FROM pickup_order WHERE id = ?', [first.body.order_id]),
      { database: process.env.DB_NAME },
    );
    expect(Number(rows[0].n)).toBe(1);
  });

  it('idempotency: misma key + payload distinto -> 409 IDEMPOTENCY_KEY_CONFLICT', async () => {
    if (!availability.available) return;
    const key = `idem-conflict-${Date.now()}`;
    const base = {
      name: 'Idempotente Conflict',
      email: 'idem-c@example.test',
      phone: '+34 600 000 010',
      pickup_date: pickFutureDate(2),
      pickup_slot: '18:00',
      items: [{ product_slug: 'queso-tetilla', qty: 1 }],
    };
    const first = await request
      .post('/api/v1/pickup-orders')
      .set('Idempotency-Key', key)
      .send(base);
    expect(first.status).toBe(201);

    const second = await request
      .post('/api/v1/pickup-orders')
      .set('Idempotency-Key', key)
      .send({ ...base, items: [{ product_slug: 'queso-tetilla', qty: 5 }] });
    expect(second.status).toBe(409);
    expect(second.body.code).toBe('IDEMPOTENCY_KEY_CONFLICT');
  });
});
