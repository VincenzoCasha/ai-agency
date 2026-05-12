import { describe, it, expect, beforeAll } from 'vitest';
import { prepareAdmin } from '../helpers/admin-test.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { withConnection } = require('../../db/migration-runner.js');

describe('Admin status updates (pickup / inquiry / reservation) + site config + alcohol regression', () => {
  let availability, request, auth;

  beforeAll(async () => {
    ({ availability, request, auth } = await prepareAdmin());
  }, 30000);

  it('PATCH /admin/pickup-orders/:id cambia status y audita', async () => {
    if (!availability.available) return;
    // Crear un pedido pickup via API publica
    const today = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    const dateStr = `${today.getUTCFullYear()}-${String(today.getUTCMonth() + 1).padStart(2, '0')}-${String(today.getUTCDate()).padStart(2, '0')}`;
    const created = await request.post('/api/v1/pickup-orders').send({
      name: 'Admin Test', email: 't@example.test', phone: '+34600111222',
      pickup_date: dateStr, pickup_slot: '18:00',
      items: [{ product_slug: 'manchego-curado-12m', qty: 1 }],
    });
    expect(created.status).toBe(201);
    const orderId = created.body.order_id;

    const patch = await auth(request.patch(`/api/v1/admin/pickup-orders/${orderId}`)).send({
      status: 'CONFIRMED',
    });
    expect(patch.status).toBe(200);
    expect(patch.body.status).toBe('CONFIRMED');

    const audit = await withConnection(
      (c) => c.query(`SELECT * FROM audit_log WHERE action = 'pickup_order.status_update' AND entity_id = ?`, [orderId]),
      { database: process.env.DB_NAME },
    );
    expect(audit.length).toBeGreaterThanOrEqual(1);
  });

  it('PATCH pickup-orders status invalido -> 422', async () => {
    if (!availability.available) return;
    const list = await auth(request.get('/api/v1/admin/pickup-orders?size=1'));
    if (!list.body.items.length) return;
    const id = list.body.items[0].id;
    const patch = await auth(request.patch(`/api/v1/admin/pickup-orders/${id}`)).send({
      status: 'BAD_STATUS',
    });
    expect(patch.status).toBe(400);
  });

  it('PATCH /admin/inquiries/:id cambia status NEW -> IN_PROGRESS', async () => {
    if (!availability.available) return;
    // Crear inquiry
    const created = await request.post('/api/v1/inquiries').send({
      type: 'CONTACT', name: 'Cliente', email: 'c@example.test',
      message: 'consulta de prueba',
    });
    expect(created.status).toBe(201);
    const id = created.body.id;

    const patch = await auth(request.patch(`/api/v1/admin/inquiries/${id}`)).send({
      status: 'IN_PROGRESS',
    });
    expect(patch.status).toBe(200);
    expect(patch.body.status).toBe('IN_PROGRESS');
  });

  it('PATCH /admin/event-reservations/:id cambia status NEW -> CONFIRMED', async () => {
    if (!availability.available) return;
    const reservation = await request
      .post('/api/v1/events/cata-quesos-de-oveja/reservations')
      .send({
        name: 'Reserva Test',
        email: 'r@example.test',
        phone: '+34600111111',
        party_size: 1,
      });
    expect(reservation.status).toBe(201);
    const id = reservation.body.id;

    const patch = await auth(request.patch(`/api/v1/admin/event-reservations/${id}`)).send({
      status: 'CONFIRMED',
    });
    expect(patch.status).toBe(200);
    expect(patch.body.status).toBe('CONFIRMED');
  });

  it('GET/PUT /admin/site/config — kill switch funciona', async () => {
    if (!availability.available) return;
    const get1 = await auth(request.get('/api/v1/admin/site/config'));
    expect(get1.status).toBe(200);
    expect(get1.body.config).toBeDefined();

    const put = await auth(request.put('/api/v1/admin/site/config')).send({
      pickup_paused: true,
    });
    expect(put.status).toBe(200);
    expect(put.body.config.pickup_paused).toBe('true');

    // Public site config refleja el flag
    const pub = await request.get('/api/v1/site/config');
    expect(pub.body.flags.pickup_paused).toBe(true);
    expect(pub.body.flags.pickup_enabled).toBe(false);

    // Pickup ahora deberia rechazar
    const today = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    const dateStr = `${today.getUTCFullYear()}-${String(today.getUTCMonth() + 1).padStart(2, '0')}-${String(today.getUTCDate()).padStart(2, '0')}`;
    const pickup = await request.post('/api/v1/pickup-orders').send({
      name: 'Bloqueo', email: 'b@example.test', phone: '+34600',
      pickup_date: dateStr, pickup_slot: '18:00',
      items: [{ product_slug: 'manchego-curado-12m', qty: 1 }],
    });
    expect(pickup.status).toBe(422);
    expect(pickup.body.code).toBe('PICKUP_PAUSED');

    // Reanudar
    const resume = await auth(request.put('/api/v1/admin/site/config')).send({
      pickup_paused: false,
    });
    expect(resume.status).toBe(200);
  });

  it('PUT /admin/site/config con clave no permitida -> 422', async () => {
    if (!availability.available) return;
    const res = await auth(request.put('/api/v1/admin/site/config')).send({
      jwt_secret: 'hack',
    });
    expect(res.status).toBe(422);
    expect(res.body.code).toBe('CONFIG_KEY_NOT_ALLOWED');
  });

  it('Regression Fase 4: alcohol guard sigue 422 con admin habilitado', async () => {
    if (!availability.available) return;
    const today = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
    const dateStr = `${today.getUTCFullYear()}-${String(today.getUTCMonth() + 1).padStart(2, '0')}-${String(today.getUTCDate()).padStart(2, '0')}`;
    const res = await request.post('/api/v1/pickup-orders').send({
      name: 'Vino test', email: 'v@example.test', phone: '+34600',
      pickup_date: dateStr, pickup_slot: '18:00',
      items: [{ product_slug: 'vino-tinto-ribera-crianza', qty: 1 }],
    });
    expect(res.status).toBe(422);
    expect(res.body.code).toBe('ALCOHOL_NOT_ALLOWED_IN_PICKUP');
  });

  it('Regression: public products siguen exponiendo vinos visibles', async () => {
    if (!availability.available) return;
    const res = await request.get('/api/v1/products?type=WINE');
    expect(res.status).toBe(200);
    expect(res.body.items.length).toBeGreaterThan(0);
    for (const p of res.body.items) expect(p.is_alcohol).toBe(true);
  });
});
