'use strict';

/**
 * Pickup model service (Fase 2 — solo modelo, no endpoint).
 *
 * Esta capa expone helpers para que la Fase 4 implemente el alcohol guard
 * de `POST /api/v1/pickup-orders`. Aqui SOLO se identifican items con alcohol;
 * el rechazo HTTP 422 se construye en Fase 4.
 */

const productRepo = require('../repositories/product.repository');

/**
 * Resuelve un item de pickup: producto + variante opcional.
 * Devuelve { product, variant, isAlcohol } donde isAlcohol es true si
 * el producto o la variante referenciada esta marcada como alcohol.
 */
async function resolvePickupItem({ productId, variantId }) {
  const product = await productRepo.findById(productId);
  if (!product) return null;

  let variant = null;
  if (variantId) {
    variant = await productRepo.findVariantById(variantId);
    if (!variant || variant.product_id !== product.id) {
      return { product, variant: null, isAlcohol: !!product.is_alcohol, error: 'VARIANT_NOT_FOUND' };
    }
  }

  const isAlcohol = !!product.is_alcohol || (variant ? !!variant.is_alcohol : false);
  return { product, variant, isAlcohol };
}

/**
 * Devuelve los items que tienen alcohol. La Fase 4 usara esto para
 * rechazar el pickup con HTTP 422 antes de crear el pedido.
 */
async function findAlcoholItems(items = []) {
  const flagged = [];
  for (const item of items) {
    const resolved = await resolvePickupItem(item);
    if (resolved && resolved.isAlcohol) {
      flagged.push({
        productId: resolved.product.id,
        variantId: resolved.variant ? resolved.variant.id : null,
        productSlug: resolved.product.slug,
      });
    }
  }
  return flagged;
}

module.exports = { resolvePickupItem, findAlcoholItems };
