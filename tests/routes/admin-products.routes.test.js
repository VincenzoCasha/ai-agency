import { describe, it, expect, beforeAll } from 'vitest';
import { prepareAdmin } from '../helpers/admin-test.js';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { withConnection } = require('../../db/migration-runner.js');

describe('Admin products CRUD', () => {
  let availability, request, auth;

  beforeAll(async () => {
    ({ availability, request, auth } = await prepareAdmin());
  }, 30000);

  it('GET /admin/products lista paginada incluyendo inactivos', async () => {
    if (!availability.available) return;
    const res = await auth(request.get('/api/v1/admin/products?size=5'));
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.pagination.size).toBe(5);
  });

  it('POST /admin/products crea queso no alcoholico (201) y registra audit', async () => {
    if (!availability.available) return;
    const res = await auth(request.post('/api/v1/admin/products')).send({
      slug: 'queso-test-admin', name: 'Queso Test Admin',
      type: 'CHEESE', is_alcohol: false,
      price_cents: 1500, vat_rate: 10,
      short_desc: 'Para test',
      stock_status: 'IN_STOCK',
    });
    expect(res.status).toBe(201);
    expect(res.body.slug).toBe('queso-test-admin');
    expect(res.body.is_alcohol).toBe(false);

    const audit = await withConnection(
      (c) => c.query(`SELECT * FROM audit_log WHERE action = 'product.create' AND entity_id = ? LIMIT 1`, [res.body.id]),
      { database: process.env.DB_NAME },
    );
    expect(audit.length).toBe(1);
  });

  it('POST type=WINE con is_alcohol=false -> 422 WINE_MUST_BE_ALCOHOL', async () => {
    if (!availability.available) return;
    const res = await auth(request.post('/api/v1/admin/products')).send({
      slug: 'vino-roto-admin', name: 'Vino mal etiquetado',
      type: 'WINE', is_alcohol: false,
      price_cents: 1000,
    });
    expect(res.status).toBe(422);
    expect(res.body.code).toBe('WINE_MUST_BE_ALCOHOL');
  });

  it('POST type=WINE sin is_alcohol -> se fuerza is_alcohol=true', async () => {
    if (!availability.available) return;
    const res = await auth(request.post('/api/v1/admin/products')).send({
      slug: 'vino-test-admin', name: 'Vino Test Admin',
      type: 'WINE',
      price_cents: 1500,
    });
    expect(res.status).toBe(201);
    expect(res.body.is_alcohol).toBe(true);
  });

  it('POST con slug duplicado -> 409 SLUG_CONFLICT', async () => {
    if (!availability.available) return;
    const res = await auth(request.post('/api/v1/admin/products')).send({
      slug: 'manchego-curado-12m',
      name: 'Conflicto', type: 'CHEESE', price_cents: 1000,
    });
    expect(res.status).toBe(409);
    expect(res.body.code).toBe('SLUG_CONFLICT');
  });

  it('PATCH /admin/products/:id/stock cambia stock_status y audita', async () => {
    if (!availability.available) return;
    const list = await auth(request.get('/api/v1/admin/products?size=1'));
    const target = list.body.items[0];
    const res = await auth(request.patch(`/api/v1/admin/products/${target.id}/stock`)).send({
      stock_status: 'OUT',
    });
    expect(res.status).toBe(200);
    expect(res.body.stock_status).toBe('OUT');

    const audit = await withConnection(
      (c) => c.query(`SELECT * FROM audit_log WHERE action = 'product.stock_update' AND entity_id = ? ORDER BY id DESC LIMIT 1`, [target.id]),
      { database: process.env.DB_NAME },
    );
    expect(audit.length).toBe(1);
  });

  it('DELETE /admin/products/:id soft delete (is_active=false)', async () => {
    if (!availability.available) return;
    // Crear uno temporal para borrar
    const created = await auth(request.post('/api/v1/admin/products')).send({
      slug: 'queso-temporal-admin', name: 'Queso Temporal',
      type: 'CHEESE', price_cents: 100,
    });
    expect(created.status).toBe(201);

    const del = await auth(request.delete(`/api/v1/admin/products/${created.body.id}`));
    expect(del.status).toBe(200);
    expect(del.body.is_active).toBe(false);

    const get = await auth(request.get(`/api/v1/admin/products/${created.body.id}`));
    expect(get.body.is_active).toBe(false);
  });

  it('PUT /admin/products/:id valida WINE -> is_alcohol=true incluso en update', async () => {
    if (!availability.available) return;
    // Buscar el manchego
    const all = await auth(request.get('/api/v1/admin/products?q=manchego'));
    const target = all.body.items[0];

    const res = await auth(request.put(`/api/v1/admin/products/${target.id}`)).send({
      type: 'WINE', is_alcohol: false,
    });
    expect(res.status).toBe(422);
    expect(res.body.code).toBe('WINE_MUST_BE_ALCOHOL');
  });

  it('endpoint sin token -> 401', async () => {
    if (!availability.available) return;
    const res = await request.get('/api/v1/admin/products');
    expect(res.status).toBe(401);
  });
});
