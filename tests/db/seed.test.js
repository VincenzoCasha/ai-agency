import { describe, it, expect, beforeAll } from 'vitest';
import {
  checkAvailability,
  resetTestDatabase,
  seedTestDatabase,
  TEST_DB,
  withConnection,
} from '../helpers/db-test.js';

describe('db/seed (dev seed)', () => {
  let availability;

  beforeAll(async () => {
    availability = await checkAvailability();
    if (availability.available) {
      await resetTestDatabase();
      await seedTestDatabase();
    }
  }, 30000);

  it('carga al menos los productos minimos requeridos por la fase 2', async () => {
    if (!availability.available) {
      console.warn(`[skip] ${availability.reason}`);
      return;
    }
    const [products] = await withConnection(
      (c) => c.query('SELECT COUNT(*) AS n FROM product'),
      { database: TEST_DB },
    );
    expect(Number(products.n)).toBeGreaterThanOrEqual(10);
  });

  it('los vinos seed tienen is_alcohol=true y los quesos is_alcohol=false', async () => {
    if (!availability.available) {
      console.warn(`[skip] ${availability.reason}`);
      return;
    }
    const wines = await withConnection(
      (c) => c.query("SELECT slug, is_alcohol FROM product WHERE type = 'WINE'"),
      { database: TEST_DB },
    );
    expect(wines.length).toBeGreaterThanOrEqual(2);
    for (const w of wines) {
      expect(Number(w.is_alcohol)).toBe(1);
    }

    const cheeses = await withConnection(
      (c) => c.query("SELECT slug, is_alcohol FROM product WHERE type = 'CHEESE'"),
      { database: TEST_DB },
    );
    expect(cheeses.length).toBeGreaterThanOrEqual(4);
    for (const ch of cheeses) {
      expect(Number(ch.is_alcohol)).toBe(0);
    }
  });

  it('hay al menos 1 producto OTHER y 4 con is_seasonal=true', async () => {
    if (!availability.available) {
      console.warn(`[skip] ${availability.reason}`);
      return;
    }
    const [other] = await withConnection(
      (c) => c.query("SELECT COUNT(*) AS n FROM product WHERE type = 'OTHER'"),
      { database: TEST_DB },
    );
    expect(Number(other.n)).toBeGreaterThanOrEqual(1);

    const [seasonal] = await withConnection(
      (c) => c.query('SELECT COUNT(*) AS n FROM product WHERE is_seasonal = 1'),
      { database: TEST_DB },
    );
    expect(Number(seasonal.n)).toBeGreaterThanOrEqual(4);
  });

  it('1 campana activa con productos asociados y 2 eventos futuros', async () => {
    if (!availability.available) {
      console.warn(`[skip] ${availability.reason}`);
      return;
    }
    const [campaigns] = await withConnection(
      (c) => c.query('SELECT COUNT(*) AS n FROM campaign WHERE is_active = 1'),
      { database: TEST_DB },
    );
    expect(Number(campaigns.n)).toBeGreaterThanOrEqual(1);

    const [campaignProducts] = await withConnection(
      (c) => c.query('SELECT COUNT(*) AS n FROM campaign_product'),
      { database: TEST_DB },
    );
    expect(Number(campaignProducts.n)).toBeGreaterThanOrEqual(1);

    const [events] = await withConnection(
      (c) => c.query('SELECT COUNT(*) AS n FROM event WHERE is_active = 1 AND starts_at > CURRENT_TIMESTAMP'),
      { database: TEST_DB },
    );
    expect(Number(events.n)).toBeGreaterThanOrEqual(2);
  });

  it('1 admin_user con hash bcrypt de desarrollo y site_config con pickup_paused', async () => {
    if (!availability.available) {
      console.warn(`[skip] ${availability.reason}`);
      return;
    }
    const admins = await withConnection(
      (c) => c.query('SELECT email, password_hash FROM admin_user'),
      { database: TEST_DB },
    );
    expect(admins.length).toBeGreaterThanOrEqual(1);
    // bcrypt hashes start with $2a$, $2b$, or $2y$
    expect(admins[0].password_hash).toMatch(/^\$2[aby]\$/);
    expect(admins[0].password_hash.length).toBeGreaterThanOrEqual(50);

    const [pp] = await withConnection(
      (c) => c.query("SELECT value_text FROM site_config WHERE config_key = 'pickup_paused'"),
      { database: TEST_DB },
    );
    expect(pp).toBeDefined();
    expect(pp.value_text).toBe('false');
  });
});
