'use strict';

const productRepo = require('../repositories/product.repository');
const audit = require('./audit.service');
const storage = require('./storage.service');

class AdminError extends Error {
  constructor(status, code, detail, extra = {}) {
    super(detail);
    this.status = status;
    this.detail = detail;
    this.title = status === 404 ? 'Not Found' : status === 409 ? 'Conflict' : status === 422 ? 'Unprocessable Entity' : 'Error';
    this.extra = { code, ...extra };
  }
}

function enforceWineAlcohol(data, currentIsAlcohol = false) {
  // Regla critica: type=WINE siempre is_alcohol=true. No se puede crear/editar
  // un vino reservable por accidente.
  if (data.type === 'WINE' && data.is_alcohol === false) {
    throw new AdminError(
      422,
      'WINE_MUST_BE_ALCOHOL',
      'Los productos de tipo WINE deben tener is_alcohol=true por contrato V1.',
    );
  }
  if (data.type === 'WINE' && data.is_alcohol === undefined) {
    data.is_alcohol = true;
  }
  // Type=CHEESE/TABLA/OTHER por defecto no alcoholico salvo justificacion.
  if (['CHEESE', 'TABLA', 'OTHER'].includes(data.type) && data.is_alcohol === undefined) {
    data.is_alcohol = currentIsAlcohol;
  }
}

async function paginate(opts) {
  return productRepo.adminPaginate(opts);
}

async function getById(id) {
  const p = await productRepo.findById(Number(id));
  if (!p) throw new AdminError(404, 'PRODUCT_NOT_FOUND', 'Producto no encontrado.');
  const [images, variants] = await Promise.all([
    productRepo.listImages(p.id),
    productRepo.listVariantsByProduct(p.id),
  ]);
  return { ...p, images, variants };
}

async function create(adminId, data) {
  enforceWineAlcohol(data);
  if (await productRepo.existsSlug(data.slug)) {
    throw new AdminError(409, 'SLUG_CONFLICT', `Ya existe un producto con slug '${data.slug}'.`);
  }
  const id = await productRepo.create(data);
  await audit.log({
    actorAdminUserId: adminId,
    action: 'product.create',
    entityType: 'product',
    entityId: id,
    payload: { slug: data.slug, type: data.type, is_alcohol: !!data.is_alcohol },
  });
  return getById(id);
}

async function update(adminId, id, data) {
  const current = await productRepo.findById(Number(id));
  if (!current) throw new AdminError(404, 'PRODUCT_NOT_FOUND', 'Producto no encontrado.');

  const merged = { ...data };
  if (data.type === undefined) merged.type = current.type;
  enforceWineAlcohol(merged, current.is_alcohol);

  if (data.slug && data.slug !== current.slug) {
    if (await productRepo.existsSlug(data.slug, current.id)) {
      throw new AdminError(409, 'SLUG_CONFLICT', `Ya existe un producto con slug '${data.slug}'.`);
    }
  }

  await productRepo.update(current.id, merged);
  await audit.log({
    actorAdminUserId: adminId,
    action: 'product.update',
    entityType: 'product',
    entityId: current.id,
    payload: { changed_keys: Object.keys(data) },
  });
  return getById(current.id);
}

async function setStock(adminId, id, stockStatus) {
  const current = await productRepo.findById(Number(id));
  if (!current) throw new AdminError(404, 'PRODUCT_NOT_FOUND', 'Producto no encontrado.');
  await productRepo.setStockStatus(current.id, stockStatus);
  await audit.log({
    actorAdminUserId: adminId,
    action: 'product.stock_update',
    entityType: 'product',
    entityId: current.id,
    payload: { from: current.stock_status, to: stockStatus },
  });
  return getById(current.id);
}

async function softDelete(adminId, id) {
  const current = await productRepo.findById(Number(id));
  if (!current) throw new AdminError(404, 'PRODUCT_NOT_FOUND', 'Producto no encontrado.');
  await productRepo.setActive(current.id, false);
  await audit.log({
    actorAdminUserId: adminId,
    action: 'product.soft_delete',
    entityType: 'product',
    entityId: current.id,
  });
  return { id: current.id, is_active: false };
}

async function addImage(adminId, productId, { file, altText, isPrimary, sortOrder }) {
  const product = await productRepo.findById(Number(productId));
  if (!product) throw new AdminError(404, 'PRODUCT_NOT_FOUND', 'Producto no encontrado.');

  const url = storage.publicUrlFor(file.filename, 'products');
  const finalAlt = altText || `${product.producer || 'CRUDO'} ${product.name}${product.region ? ', ' + product.region : ''}`;
  const id = await productRepo.addImage({
    productId: product.id,
    url,
    altText: finalAlt,
    sortOrder: Number(sortOrder) || 0,
    isPrimary: !!isPrimary,
  });
  await audit.log({
    actorAdminUserId: adminId,
    action: 'product.image_add',
    entityType: 'product_image',
    entityId: id,
    payload: { product_id: product.id, url, is_primary: !!isPrimary },
  });
  return productRepo.findImageById(id);
}

async function deleteImage(adminId, productId, imageId) {
  const image = await productRepo.findImageById(Number(imageId));
  if (!image || image.product_id !== Number(productId)) {
    throw new AdminError(404, 'IMAGE_NOT_FOUND', 'Imagen no encontrada para este producto.');
  }
  await productRepo.deleteImage(image.id);
  await storage.deleteByPublicUrl(image.url).catch(() => null);
  await audit.log({
    actorAdminUserId: adminId,
    action: 'product.image_delete',
    entityType: 'product_image',
    entityId: image.id,
    payload: { product_id: image.product_id, url: image.url },
  });
  return { id: image.id, deleted: true };
}

module.exports = {
  paginate,
  getById,
  create,
  update,
  setStock,
  softDelete,
  addImage,
  deleteImage,
  AdminError,
};
