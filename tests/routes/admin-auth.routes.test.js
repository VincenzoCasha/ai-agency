import { describe, it, expect, beforeAll } from 'vitest';
import { prepareApp } from '../helpers/app-test.js';
import { SEED_ADMIN_EMAIL, SEED_ADMIN_PASSWORD } from '../helpers/admin-test.js';

describe('Admin auth — POST /api/v1/admin/auth/login', () => {
  let availability, request;

  beforeAll(async () => {
    ({ availability, request } = await prepareApp());
  }, 30000);

  it('login valido devuelve access_token + refresh_token + admin', async () => {
    if (!availability.available) return;
    const res = await request.post('/api/v1/admin/auth/login').send({
      email: SEED_ADMIN_EMAIL,
      password: SEED_ADMIN_PASSWORD,
    });
    expect(res.status).toBe(200);
    expect(res.body.access_token).toBeTypeOf('string');
    expect(res.body.refresh_token).toBeTypeOf('string');
    expect(res.body.token_type).toBe('Bearer');
    expect(res.body.admin.email).toBe(SEED_ADMIN_EMAIL);
    expect(res.body.admin).not.toHaveProperty('password_hash');
  });

  it('login con password incorrecto -> 401 RFC 7807 INVALID_CREDENTIALS', async () => {
    if (!availability.available) return;
    const res = await request.post('/api/v1/admin/auth/login').send({
      email: SEED_ADMIN_EMAIL,
      password: 'wrong-password',
    });
    expect(res.status).toBe(401);
    expect(res.headers['content-type']).toMatch('application/problem+json');
    expect(res.body.code).toBe('INVALID_CREDENTIALS');
  });

  it('login con email inexistente -> 401 (no filtra existencia)', async () => {
    if (!availability.available) return;
    const res = await request.post('/api/v1/admin/auth/login').send({
      email: 'no-existe@example.test',
      password: 'whatever',
    });
    expect(res.status).toBe(401);
    expect(res.body.code).toBe('INVALID_CREDENTIALS');
  });

  it('login con email mal formado -> 400 RFC 7807', async () => {
    if (!availability.available) return;
    const res = await request.post('/api/v1/admin/auth/login').send({
      email: 'no-es-email', password: '12345',
    });
    expect(res.status).toBe(400);
  });

  it('refresh con refresh_token valido emite tokens nuevos y rota', async () => {
    if (!availability.available) return;
    const login = await request.post('/api/v1/admin/auth/login').send({
      email: SEED_ADMIN_EMAIL,
      password: SEED_ADMIN_PASSWORD,
    });
    const oldRefresh = login.body.refresh_token;

    const refresh = await request.post('/api/v1/admin/auth/refresh').send({
      refresh_token: oldRefresh,
    });
    expect(refresh.status).toBe(200);
    expect(refresh.body.refresh_token).toBeTypeOf('string');
    expect(refresh.body.refresh_token).not.toBe(oldRefresh);

    // El refresh viejo no debe servir despues de la rotacion.
    const reuse = await request.post('/api/v1/admin/auth/refresh').send({
      refresh_token: oldRefresh,
    });
    expect(reuse.status).toBe(401);
    expect(reuse.body.code).toBe('REFRESH_TOKEN_REVOKED');
  });

  it('logout revoca el refresh token recibido', async () => {
    if (!availability.available) return;
    const login = await request.post('/api/v1/admin/auth/login').send({
      email: SEED_ADMIN_EMAIL,
      password: SEED_ADMIN_PASSWORD,
    });
    const logout = await request.post('/api/v1/admin/auth/logout').send({
      refresh_token: login.body.refresh_token,
    });
    expect(logout.status).toBe(204);
    const reuse = await request.post('/api/v1/admin/auth/refresh').send({
      refresh_token: login.body.refresh_token,
    });
    expect(reuse.status).toBe(401);
  });
});

describe('Admin protection — endpoints requieren JWT', () => {
  let availability, request;

  beforeAll(async () => {
    ({ availability, request } = await prepareApp());
  }, 30000);

  it('GET /admin/dashboard sin token -> 401 TOKEN_MISSING', async () => {
    if (!availability.available) return;
    const res = await request.get('/api/v1/admin/dashboard');
    expect(res.status).toBe(401);
    expect(res.body.code).toBe('TOKEN_MISSING');
  });

  it('GET /admin/dashboard con token mal firmado -> 401', async () => {
    if (!availability.available) return;
    const res = await request
      .get('/api/v1/admin/dashboard')
      .set('Authorization', 'Bearer not.a.real.jwt');
    expect(res.status).toBe(401);
  });

  it('Public /api/v1/products sigue abierto sin token', async () => {
    if (!availability.available) return;
    const res = await request.get('/api/v1/products?size=1');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.items)).toBe(true);
  });

  it('Public /api/v1/health sigue abierto', async () => {
    if (!availability.available) return;
    const res = await request.get('/api/v1/health');
    expect(res.status).toBe(200);
  });
});
