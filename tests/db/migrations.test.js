import { describe, it, expect, beforeAll } from 'vitest';
import { checkAvailability, resetTestDatabase, TEST_DB, withConnection } from '../helpers/db-test.js';
import { listMigrationFiles } from '../../db/migration-runner.js';

describe('db/migrations', () => {
  let availability;

  beforeAll(async () => {
    availability = await checkAvailability();
    if (availability.available) {
      await resetTestDatabase();
    }
  }, 30000);

  it('lista los archivos de migracion en orden', () => {
    const files = listMigrationFiles();
    expect(files.length).toBeGreaterThanOrEqual(2);
    expect(files[0]).toBe('001_create_core_schema.sql');
  });

  it('crea la tabla schema_migrations y registra cada archivo', async () => {
    if (!availability.available) {
      console.warn(`[skip] ${availability.reason}`);
      return;
    }
    const rows = await withConnection(
      (c) => c.query('SELECT name FROM schema_migrations ORDER BY name'),
      { database: TEST_DB },
    );
    const names = rows.map((r) => r.name);
    expect(names).toContain('001_create_core_schema.sql');
    expect(names).toContain('002_create_indexes.sql');
  });

  it('crea las tablas obligatorias del schema V1', async () => {
    if (!availability.available) {
      console.warn(`[skip] ${availability.reason}`);
      return;
    }
    const expected = [
      'admin_user', 'audit_log', 'campaign', 'campaign_product',
      'category', 'consent_log', 'event', 'event_reservation',
      'inquiry', 'newsletter_subscriber', 'pickup_order',
      'pickup_order_item', 'product', 'product_category',
      'product_image', 'product_variant', 'site_config',
      'schema_migrations',
    ];
    const rows = await withConnection(
      (c) => c.query(
        'SELECT TABLE_NAME AS name FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?',
        [TEST_DB],
      ),
      { database: TEST_DB },
    );
    const names = rows.map((r) => r.name).sort();
    for (const t of expected) {
      expect(names).toContain(t);
    }
  });

  it('product.is_alcohol es NOT NULL con default 0', async () => {
    if (!availability.available) {
      console.warn(`[skip] ${availability.reason}`);
      return;
    }
    const rows = await withConnection(
      (c) => c.query(
        `SELECT IS_NULLABLE, COLUMN_DEFAULT
         FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'product' AND COLUMN_NAME = 'is_alcohol'`,
        [TEST_DB],
      ),
      { database: TEST_DB },
    );
    expect(rows.length).toBe(1);
    expect(rows[0].IS_NULLABLE).toBe('NO');
    expect(String(rows[0].COLUMN_DEFAULT)).toBe('0');
  });
});
