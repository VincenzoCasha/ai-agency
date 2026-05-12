import { describe, it, expect, beforeAll } from 'vitest';
import { prepareAdmin } from '../helpers/admin-test.js';

describe('Admin dashboard + KPIs', () => {
  let availability, request, auth;

  beforeAll(async () => {
    ({ availability, request, auth } = await prepareAdmin());
  }, 30000);

  it('GET /admin/dashboard devuelve bloques compactos accionables', async () => {
    if (!availability.available) return;
    const res = await auth(request.get('/api/v1/admin/dashboard'));
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('pickups_today');
    expect(res.body).toHaveProperty('events_upcoming');
    expect(res.body).toHaveProperty('inquiries_new');
    expect(res.body).toHaveProperty('stock_alerts');
    expect(Array.isArray(res.body.quick_actions)).toBe(true);
    expect(res.body.quick_actions.length).toBeGreaterThan(0);
  });

  it('GET /admin/kpis?period=7d devuelve metricas de pickup y newsletter', async () => {
    if (!availability.available) return;
    const res = await auth(request.get('/api/v1/admin/kpis?period=7d'));
    expect(res.status).toBe(200);
    expect(res.body.period).toBe('7d');
    expect(res.body.pickup).toBeDefined();
    expect(res.body.pickup.by_status).toBeDefined();
    expect(typeof res.body.pickup.completed_revenue_cents).toBe('number');
    expect(res.body.newsletter.total_active).toBeGreaterThanOrEqual(0);
    expect(res.body.events).toBeDefined();
  });

  it('GET /admin/kpis?period=invalid -> 400', async () => {
    if (!availability.available) return;
    const res = await auth(request.get('/api/v1/admin/kpis?period=year'));
    expect(res.status).toBe(400);
  });
});
