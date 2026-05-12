import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  checkAvailability,
  resetTestDatabase,
  seedTestDatabase,
} from '../helpers/db-test.js';
import * as productRepo from '../../server/repositories/product.repository.js';
import { closePool } from '../../db/pool.js';

describe('product.repository', () => {
  let availability;

  beforeAll(async () => {
    availability = await checkAvailability();
    if (availability.available) {
      await resetTestDatabase();
      await seedTestDatabase();
    }
  }, 30000);

  afterAll(async () => {
    if (availability && availability.available) {
      await closePool();
    }
  });

  it('listActive devuelve productos is_active=true', async () => {
    if (!availability.available) {
      console.warn(`[skip] ${availability.reason}`);
      return;
    }
    const all = await productRepo.listActive();
    expect(all.length).toBeGreaterThan(0);
    for (const p of all) {
      expect(p.is_active).toBe(true);
    }
  });

  it('filtra por type=CHEESE', async () => {
    if (!availability.available) {
      console.warn(`[skip] ${availability.reason}`);
      return;
    }
    const cheeses = await productRepo.listActive({ type: 'CHEESE' });
    expect(cheeses.length).toBeGreaterThanOrEqual(4);
    for (const p of cheeses) expect(p.type).toBe('CHEESE');
  });

  it('filtra por isAlcohol=false (excluye vinos)', async () => {
    if (!availability.available) {
      console.warn(`[skip] ${availability.reason}`);
      return;
    }
    const nonAlcohol = await productRepo.listActive({ isAlcohol: false });
    for (const p of nonAlcohol) expect(p.is_alcohol).toBe(false);
  });

  it('findBySlugWithCategories devuelve producto con categorias', async () => {
    if (!availability.available) {
      console.warn(`[skip] ${availability.reason}`);
      return;
    }
    const product = await productRepo.findBySlugWithCategories('manchego-curado-12m');
    expect(product).not.toBeNull();
    expect(product.slug).toBe('manchego-curado-12m');
    expect(Array.isArray(product.categories)).toBe(true);
    expect(product.categories.length).toBeGreaterThan(0);
  });

  it('listVariantsByProduct devuelve variantes incluyendo las con maridaje vino (is_alcohol=true)', async () => {
    if (!availability.available) {
      console.warn(`[skip] ${availability.reason}`);
      return;
    }
    const tabla3 = await productRepo.findBySlugWithCategories('tabla-3-quesos');
    expect(tabla3).not.toBeNull();
    const variants = await productRepo.listVariantsByProduct(tabla3.id);
    expect(variants.length).toBeGreaterThanOrEqual(2);
    const withWine = variants.filter((v) => v.is_alcohol);
    const withoutWine = variants.filter((v) => !v.is_alcohol);
    expect(withWine.length).toBeGreaterThanOrEqual(1);
    expect(withoutWine.length).toBeGreaterThanOrEqual(1);
  });

  it('slug duplicado falla con error de unicidad', async () => {
    if (!availability.available) {
      console.warn(`[skip] ${availability.reason}`);
      return;
    }
    const { query } = await import('../../db/pool.js');
    await expect(
      query(
        `INSERT INTO product (slug, name, type, is_alcohol, price_cents)
         VALUES ('manchego-curado-12m', 'duplicado', 'CHEESE', 0, 100)`,
      ),
    ).rejects.toThrow();
  });
});
