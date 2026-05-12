import { describe, it, expect, beforeAll } from 'vitest';
import { prepareApp } from '../helpers/app-test.js';

describe('GET /api/v1/site/config', () => {
  let availability, request;

  beforeAll(async () => {
    ({ availability, request } = await prepareApp());
  }, 30000);

  it('devuelve datos publicos sin secretos', async () => {
    if (!availability.available) return;
    const res = await request.get('/api/v1/site/config');
    expect(res.status).toBe(200);
    expect(res.body.brand).toBe('CRUDO');
    expect(res.body.legal_name).toContain('CRUDO QUESOS');
    expect(res.body.vat_id).toBe('B-19953694');
    expect(res.body.flags).toBeDefined();
    expect(typeof res.body.flags.pickup_enabled).toBe('boolean');
    expect(res.body.pickup.sla_text).toMatch(/24/);
    // Sin secretos
    expect(JSON.stringify(res.body)).not.toMatch(/JWT_SECRET|COOKIE_SECRET|password/i);
    expect(res.headers['cache-control']).toContain('public');
  });
});

describe('Campaigns API', () => {
  let availability, request;

  beforeAll(async () => {
    ({ availability, request } = await prepareApp());
  }, 30000);

  it('GET /api/v1/campaigns/active devuelve campana con productos', async () => {
    if (!availability.available) return;
    const res = await request.get('/api/v1/campaigns/active');
    expect(res.status).toBe(200);
    expect(res.body.campaign).not.toBeNull();
    expect(res.body.campaign.slug).toBe('temporada-primavera');
    expect(Array.isArray(res.body.campaign.products)).toBe(true);
    expect(res.body.campaign.products.length).toBeGreaterThan(0);
  });

  it('GET /api/v1/campaigns/:slug 404 si no existe', async () => {
    if (!availability.available) return;
    const res = await request.get('/api/v1/campaigns/no-existe');
    expect(res.status).toBe(404);
    expect(res.headers['content-type']).toMatch('application/problem+json');
  });
});
