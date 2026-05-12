'use strict';

/**
 * Pickup order service — Mi Tabla backend (Fase 4).
 *
 * Reglas obligatorias (no negociables):
 *  - NO se aceptan productos o variantes con `is_alcohol=true`. Si cualquier
 *    item lo es, se rechaza el pedido entero con HTTP 422 RFC 7807 y NO se
 *    persiste nada (ni el pedido ni los items).
 *  - El precio NUNCA viene del cliente: se resuelve siempre desde DB usando
 *    `product.price_cents` o `product_variant.price_cents` cuando hay variante.
 *  - El pedido se persiste en una transaccion: si falla cualquier item, se
 *    revierte el pedido entero (lo gestiona el repositorio).
 *  - El status inicial siempre es `NEW`. La notificacion al owner se emite
 *    DESPUES del commit; un fallo en notificar nunca rompe la respuesta.
 */

const productRepo = require('../repositories/product.repository');
const pickupRepo = require('../repositories/pickup-order.repository');
const siteConfigService = require('./site-config.service');
const notification = require('./notification.service');

// ── Configuracion de slots/dias ─────────────────────────────────────────────
// Horarios placeholder alineados con `STATIC_PUBLIC_INFO.hours`.
// Cuando llegue la fuente real bastara con leer site_config.
const PICKUP_HOURS_BY_DOW = {
  // 0=domingo, 1=lunes, ...
  0: { open: '12:30', close: '20:00' },
  1: { open: '17:30', close: '23:00' },
  2: { open: '17:30', close: '23:00' },
  3: { open: '17:30', close: '23:00' },
  4: { open: '17:30', close: '23:00' },
  5: { open: '17:30', close: '23:00' },
  6: { open: '12:30', close: '22:00' },
};

const MAX_DAYS_AHEAD = 14;
const SLOT_FORMAT = /^([01]\d|2[0-3]):(00|30)$/;

const CONFIRMATION_MESSAGE = (
  'Hemos recibido tu solicitud de Mi Tabla. El pago se realiza en CRUDO al recoger. ' +
  'Confirmamos por WhatsApp en menos de 24 horas dentro del horario de apertura.'
);

class PickupValidationError extends Error {
  constructor(status, code, detail, extra = {}) {
    super(detail);
    this.status = status;
    this.detail = detail;
    this.title = status === 422 ? 'Unprocessable Entity' : 'Conflict';
    if (status === 404) this.title = 'Not Found';
    this.extra = { code, ...extra };
  }
}

function timeToMinutes(hhmm) {
  const m = SLOT_FORMAT.exec(hhmm);
  if (!m) return null;
  return Number(m[1]) * 60 + Number(m[2]);
}

function isValidDateString(d) {
  if (typeof d !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(d)) return false;
  const dt = new Date(`${d}T00:00:00Z`);
  return !Number.isNaN(dt.getTime());
}

function todayUTC() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

function validateDateAndSlot(pickupDate, pickupSlot) {
  if (!isValidDateString(pickupDate)) {
    throw new PickupValidationError(422, 'INVALID_DATE_FORMAT', 'pickup_date debe tener formato YYYY-MM-DD.');
  }
  const target = new Date(`${pickupDate}T00:00:00Z`);
  const today = todayUTC();
  const maxDate = new Date(today.getTime() + MAX_DAYS_AHEAD * 24 * 60 * 60 * 1000);

  if (target.getTime() < today.getTime()) {
    throw new PickupValidationError(422, 'PICKUP_DATE_PAST', 'No se puede reservar pickup para fechas pasadas.');
  }
  if (target.getTime() > maxDate.getTime()) {
    throw new PickupValidationError(
      422,
      'PICKUP_DATE_TOO_FAR',
      `pickup_date no puede superar ${MAX_DAYS_AHEAD} dias desde hoy.`,
      { max_days_ahead: MAX_DAYS_AHEAD },
    );
  }

  if (!SLOT_FORMAT.test(pickupSlot)) {
    throw new PickupValidationError(
      422,
      'INVALID_SLOT_FORMAT',
      'pickup_slot debe tener formato HH:mm en incrementos de 30 minutos.',
    );
  }

  const hours = PICKUP_HOURS_BY_DOW[target.getUTCDay()];
  if (!hours) {
    throw new PickupValidationError(422, 'PICKUP_DAY_CLOSED', 'CRUDO esta cerrado ese dia.');
  }
  const slotMin = timeToMinutes(pickupSlot);
  const openMin = timeToMinutes(hours.open);
  const closeMin = timeToMinutes(hours.close);
  if (slotMin < openMin || slotMin > closeMin - 30) {
    throw new PickupValidationError(
      422,
      'PICKUP_SLOT_OUT_OF_HOURS',
      `El slot ${pickupSlot} esta fuera del horario de apertura (${hours.open}-${hours.close}).`,
      { open: hours.open, close: hours.close },
    );
  }
}

async function ensurePickupEnabled() {
  const cfg = await siteConfigService.getPublicConfig();
  if (cfg.flags && cfg.flags.pickup_paused) {
    throw new PickupValidationError(
      422,
      'PICKUP_PAUSED',
      'El servicio de pickup esta temporalmente pausado. Vuelve a intentarlo mas tarde.',
    );
  }
}

/**
 * Resuelve los items recibidos en el body contra DB. Cada item de entrada:
 *   { product_id?, product_slug?, variant_id?, variant_slug?, qty }
 *
 * Aplica la regla obligatoria de alcohol: si cualquier producto/variante
 * referenciado tiene is_alcohol=true, lanza 422 con detalle de items invalidos.
 */
async function resolveAndValidateItems(rawItems) {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw new PickupValidationError(422, 'ITEMS_EMPTY', 'items debe contener al menos un producto.');
  }

  const productIds = [];
  const productSlugs = [];
  const variantIds = [];
  const variantSlugs = [];

  for (const item of rawItems) {
    if (Number.isInteger(item.product_id) && item.product_id > 0) productIds.push(item.product_id);
    if (typeof item.product_slug === 'string' && item.product_slug) productSlugs.push(item.product_slug);
    if (Number.isInteger(item.variant_id) && item.variant_id > 0) variantIds.push(item.variant_id);
    if (typeof item.variant_slug === 'string' && item.variant_slug) variantSlugs.push(item.variant_slug);
  }

  const [products, variants] = await Promise.all([
    productRepo.findActiveByIdsOrSlugs({ ids: productIds, slugs: productSlugs }),
    productRepo.findVariantsByIdsOrSlugs({ ids: variantIds, slugs: variantSlugs }),
  ]);

  const resolved = [];
  const notFound = [];
  const alcoholItems = [];
  const stockOut = [];

  for (const item of rawItems) {
    let product = null;
    if (Number.isInteger(item.product_id)) product = products.byId.get(item.product_id) || null;
    if (!product && item.product_slug) product = products.bySlug.get(item.product_slug) || null;

    if (!product) {
      notFound.push({ product_id: item.product_id || null, product_slug: item.product_slug || null });
      continue;
    }

    let variant = null;
    if (Number.isInteger(item.variant_id)) variant = variants.byId.get(item.variant_id) || null;
    if (!variant && item.variant_slug) variant = variants.bySlug.get(item.variant_slug) || null;

    if ((item.variant_id || item.variant_slug) && (!variant || variant.product_id !== product.id)) {
      notFound.push({
        product_id: product.id,
        product_slug: product.slug,
        variant_id: item.variant_id || null,
        variant_slug: item.variant_slug || null,
        reason: 'variant_not_found_or_mismatch',
      });
      continue;
    }

    const isAlcohol = !!product.is_alcohol || (variant ? !!variant.is_alcohol : false);
    if (isAlcohol) {
      alcoholItems.push({
        product_id: product.id,
        product_slug: product.slug,
        variant_id: variant ? variant.id : null,
        variant_slug: variant ? variant.slug : null,
      });
      continue;
    }

    if (product.stock_status === 'OUT') {
      stockOut.push({ product_id: product.id, product_slug: product.slug });
      continue;
    }

    const unitPrice = variant ? variant.price_cents : product.price_cents;
    resolved.push({
      product_id: product.id,
      product_slug: product.slug,
      variant_id: variant ? variant.id : null,
      variant_slug: variant ? variant.slug : null,
      qty: item.qty,
      unit_price_cents: unitPrice,
      line_total_cents: unitPrice * item.qty,
    });
  }

  if (alcoholItems.length) {
    const err = new PickupValidationError(
      422,
      'ALCOHOL_NOT_ALLOWED_IN_PICKUP',
      'Los productos con alcohol no se pueden reservar via Mi Tabla. Pregunta por WhatsApp.',
      { invalid_items: alcoholItems },
    );
    err.problemType = 'https://crudo.es/problems/pickup-alcohol-not-allowed';
    err.title = 'Alcohol products cannot be reserved for pickup';
    throw err;
  }

  if (notFound.length) {
    throw new PickupValidationError(
      404,
      'PRODUCT_NOT_FOUND',
      'Uno o mas productos solicitados no existen o no estan activos.',
      { invalid_items: notFound },
    );
  }

  if (stockOut.length) {
    throw new PickupValidationError(
      422,
      'PRODUCT_OUT_OF_STOCK',
      'Uno o mas productos estan agotados.',
      { invalid_items: stockOut },
    );
  }

  return resolved;
}

async function createPickupOrder(payload) {
  await ensurePickupEnabled();
  validateDateAndSlot(payload.pickup_date, payload.pickup_slot);

  const items = await resolveAndValidateItems(payload.items);
  const totalCents = items.reduce((acc, it) => acc + it.line_total_cents, 0);

  const orderId = await pickupRepo.createWithItems({
    order: {
      name: payload.name,
      email: payload.email,
      phone: payload.phone,
      pickup_date: payload.pickup_date,
      pickup_slot: payload.pickup_slot,
      notes: payload.notes,
      total_cents: totalCents,
    },
    items,
  });

  // Notificar SIEMPRE despues del commit. Tolerante a fallos del adaptador.
  try {
    await notification.notifyNewPickupOrder({
      id: orderId,
      name: payload.name,
      phone: payload.phone,
      pickup_date: payload.pickup_date,
      pickup_slot: payload.pickup_slot,
      total_cents: totalCents,
      items: items.map((it) => ({
        product_slug: it.product_slug,
        variant_slug: it.variant_slug,
        qty: it.qty,
        unit_price_cents: it.unit_price_cents,
      })),
    });
  } catch {
    // Documentado: un fallo en notification no debe romper la respuesta al cliente.
  }

  return {
    order_id: orderId,
    status: 'NEW',
    total_cents: totalCents,
    currency: 'EUR',
    items: items.map((it) => ({
      product_id: it.product_id,
      product_slug: it.product_slug,
      variant_id: it.variant_id,
      variant_slug: it.variant_slug,
      qty: it.qty,
      unit_price_cents: it.unit_price_cents,
      line_total_cents: it.line_total_cents,
    })),
    confirmation_message: CONFIRMATION_MESSAGE,
  };
}

module.exports = {
  createPickupOrder,
  validateDateAndSlot,
  resolveAndValidateItems,
  PickupValidationError,
  CONFIRMATION_MESSAGE,
  MAX_DAYS_AHEAD,
};
