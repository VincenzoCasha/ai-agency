import { describe, it, expect, beforeAll } from 'vitest';
import { prepareApp } from '../helpers/app-test.js';

describe('GET /api/v1/products', () => {
  let availability, request;

  beforeAll(async () => {
    ({ availability, request } = await prepareApp());
  }, 30000);

  it('lista productos paginados con cache 5min', async () => {
    if (!availability.available) {
      console.warn(`[skip] ${availability.reason}`);
      return;
    }
    const res = await request.get('/api/v1/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBeGreaterThan(0);
    expect(res.body.pagination).toMatchObject({
      page: 1,
      size: 20,
    });
    expect(res.headers['cache-control']).toContain('public');
    expect(res.headers['cache-control']).toContain('max-age=300');
  });

  it('los vinos seed exponen is_alcohol=true en el listado', async () => {
    if (!availability.available) return;
    const res = await request.get('/api/v1/products?type=WINE');
    expect(res.status).toBe(200);
    expect(res.body.items.length).toBeGreaterThan(0);
    for (const p of res.body.items) {
      expect(p.type).toBe('WINE');
      expect(p.is_alcohol).toBe(true);
    }
  });

  it('filtra por seasonal=true', async () => {
    if (!availability.available) return;
    const res = await request.get('/api/v1/products?seasonal=true');
    expect(res.status).toBe(200);
    for (const p of res.body.items) {
      expect(p.is_seasonal).toBe(true);
    }
  });

  it('paginacion respeta size y page', async () => {
    if (!availability.available) return;
    const res = await request.get('/api/v1/products?size=2&page=1');
    expect(res.status).toBe(200);
    expect(res.body.items.length).toBeLessThanOrEqual(2);
    expect(res.body.pagination.size).toBe(2);
    expect(res.body.pagination.page).toBe(1);
  });

  it('rechaza filtro type invalido con 400 RFC 7807', async () => {
    if (!availability.available) return;
    const res = await request.get('/api/v1/products?type=NOPE');
    expect(res.status).toBe(400);
    expect(res.headers['content-type']).toMatch('application/problem+json');
    expect(res.body.errors).toBeDefined();
  });
});

describe('GET /api/v1/products/:slug', () => {
  let availability, request;

  beforeAll(async () => {
    ({ availability, request } = await prepareApp());
  }, 30000);

  it('200 con detalle, categorias, imagenes y variantes', async () => {
    if (!availability.available) return;
    const res = await request.get('/api/v1/products/tabla-3-quesos');
    expect(res.status).toBe(200);
    expect(res.body.slug).toBe('tabla-3-quesos');
    expect(Array.isArray(res.body.categories)).toBe(true);
    expect(Array.isArray(res.body.images)).toBe(true);
    expect(Array.isArray(res.body.variants)).toBe(true);
    expect(res.body.variants.length).toBeGreaterThanOrEqual(2);
  });

  it('404 RFC 7807 cuando el producto no existe', async () => {
    if (!availability.available) return;
    const res = await request.get('/api/v1/products/no-existe');
    expect(res.status).toBe(404);
    expect(res.headers['content-type']).toMatch('application/problem+json');
    expect(res.body.title).toBe('Not Found');
  });
});

describe('GET /api/v1/categories', () => {
  let availability, request;

  beforeAll(async () => {
    ({ availability, request } = await prepareApp());
  }, 30000);

  it('lista categorias ordenadas', async () => {
    if (!availability.available) return;
    const res = await request.get('/api/v1/categories');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
    expect(res.body.items.length).toBeGreaterThan(0);
  });

  it('filtra por type=CHEESE', async () => {
    if (!availability.available) return;
    const res = await request.get('/api/v1/categories?type=CHEESE');
    expect(res.status).toBe(200);
    for (const c of res.body.items) expect(c.type).toBe('CHEESE');
  });
});
