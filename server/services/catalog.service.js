'use strict';

/**
 * Catalog service — solo lectura para Fase 3.
 * Reglas de negocio:
 *  - Solo entidades activas se exponen al publico.
 *  - El campo `is_alcohol` debe llegar al frontend para que decida CTA WhatsApp.
 *  - El detalle incluye categorias, imagenes ordenadas y variantes activas.
 */

const productRepo = require('../repositories/product.repository');
const categoryRepo = require('../repositories/category.repository');

async function paginateProducts(filters = {}, pagination = {}) {
  return productRepo.paginate(filters, pagination);
}

async function listCheeses(filters = {}) {
  return productRepo.listActive({
    type: 'CHEESE',
    isAlcohol: false,
    ...filters,
  });
}

async function listSeasonal() {
  return productRepo.listActive({ isSeasonal: true, isAlcohol: false });
}

async function listTablas() {
  return productRepo.listActive({ type: 'TABLA' });
}

async function listAllNonAlcoholActive() {
  return productRepo.listActive({ isAlcohol: false });
}

/**
 * Detalle publico por slug. Devuelve null si no existe o esta inactivo.
 * Incluye categorias, imagenes ordenadas y variantes.
 */
async function getActiveProductDetail(slug) {
  const base = await productRepo.findActiveBySlug(slug);
  if (!base) return null;

  const [withCategories, images, variants] = await Promise.all([
    productRepo.findBySlugWithCategories(slug),
    productRepo.listImages(base.id),
    productRepo.listVariantsByProduct(base.id),
  ]);

  return {
    ...withCategories,
    images,
    variants,
  };
}

async function listCategories(type) {
  return categoryRepo.listAll(type ? { type } : {});
}

module.exports = {
  paginateProducts,
  listCheeses,
  listSeasonal,
  listTablas,
  listAllNonAlcoholActive,
  getActiveProductDetail,
  listCategories,
};
