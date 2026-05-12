import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  checkAvailability,
  resetTestDatabase,
  seedTestDatabase,
} from '../helpers/db-test.js';
import * as catalogService from '../../server/services/catalog.service.js';
import * as eventService from '../../server/services/event.service.js';
import * as pickupModel from '../../server/services/pickup-model.service.js';
import * as productRepo from '../../server/repositories/product.repository.js';
import { closePool } from '../../db/pool.js';

describe('catalog/event/pickup-model services', () => {
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

  it('listCheeses excluye alcohol y devuelve solo CHEESE', async () => {
    if (!availability.available) {
      console.warn(`[skip] ${availability.reason}`);
      return;
    }
    const cheeses = await catalogService.listCheeses();
    expect(cheeses.length).toBeGreaterThanOrEqual(4);
    for (const p of cheeses) {
      expect(p.type).toBe('CHEESE');
      expect(p.is_alcohol).toBe(false);
    }
  });

  it('listSeasonal devuelve productos de temporada', async () => {
    if (!availability.available) {
      console.warn(`[skip] ${availability.reason}`);
      return;
    }
    const seasonal = await catalogService.listSeasonal();
    expect(seasonal.length).toBeGreaterThanOrEqual(1);
    for (const p of seasonal) {
      expect(p.is_seasonal).toBe(true);
      expect(p.is_alcohol).toBe(false);
    }
  });

  it('listTablas devuelve productos type=TABLA', async () => {
    if (!availability.available) {
      console.warn(`[skip] ${availability.reason}`);
      return;
    }
    const tablas = await catalogService.listTablas();
    expect(tablas.length).toBeGreaterThanOrEqual(2);
    for (const p of tablas) expect(p.type).toBe('TABLA');
  });

  it('getProductDetail incluye categorias y variantes', async () => {
    if (!availability.available) {
      console.warn(`[skip] ${availability.reason}`);
      return;
    }
    const detail = await catalogService.getActiveProductDetail('tabla-3-quesos');
    expect(detail).not.toBeNull();
    expect(Array.isArray(detail.categories)).toBe(true);
    expect(Array.isArray(detail.variants)).toBe(true);
    expect(detail.variants.length).toBeGreaterThanOrEqual(2);
  });

  it('event.service listUpcoming devuelve eventos futuros ordenados por fecha', async () => {
    if (!availability.available) {
      console.warn(`[skip] ${availability.reason}`);
      return;
    }
    const events = await eventService.listUpcoming(10);
    expect(events.length).toBeGreaterThanOrEqual(2);
    const now = Date.now();
    for (const ev of events) {
      expect(new Date(ev.starts_at).getTime()).toBeGreaterThan(now);
    }
    for (let i = 1; i < events.length; i++) {
      expect(new Date(events[i].starts_at).getTime())
        .toBeGreaterThanOrEqual(new Date(events[i - 1].starts_at).getTime());
    }
  });

  it('pickup-model identifica items con alcohol (preparado para fase 4)', async () => {
    if (!availability.available) {
      console.warn(`[skip] ${availability.reason}`);
      return;
    }
    const tabla = await productRepo.findBySlugWithCategories('tabla-3-quesos');
    const variants = await productRepo.listVariantsByProduct(tabla.id);
    const wineVariant = variants.find((v) => v.is_alcohol);
    const noWineVariant = variants.find((v) => !v.is_alcohol);

    const flagged = await pickupModel.findAlcoholItems([
      { productId: tabla.id, variantId: noWineVariant.id },
      { productId: tabla.id, variantId: wineVariant.id },
    ]);
    expect(flagged.length).toBe(1);
    expect(flagged[0].variantId).toBe(wineVariant.id);
  });
});
