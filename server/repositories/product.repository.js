'use strict';

/**
 * Product repository.
 * Capa SQL pura: no aplica reglas de negocio (eso lo hacen los services).
 * Devuelve filas tal cual con tipados booleanos normalizados.
 */

const { query } = require('../../db/pool');

function normalize(row) {
  if (!row) return null;
  return {
    ...row,
    id: Number(row.id),
    is_alcohol:  !!row.is_alcohol,
    is_seasonal: !!row.is_seasonal,
    is_featured: !!row.is_featured,
    is_active:   !!row.is_active,
    price_cents: Number(row.price_cents),
    vat_rate:    row.vat_rate !== null && row.vat_rate !== undefined ? Number(row.vat_rate) : null,
  };
}

function buildFilters({ type, isAlcohol, isSeasonal, isFeatured, categorySlug, q } = {}) {
  const where = ['p.is_active = 1'];
  const params = [];
  let join = '';

  if (type) {
    where.push('p.type = ?');
    params.push(type);
  }
  if (typeof isAlcohol === 'boolean') {
    where.push('p.is_alcohol = ?');
    params.push(isAlcohol ? 1 : 0);
  }
  if (typeof isSeasonal === 'boolean') {
    where.push('p.is_seasonal = ?');
    params.push(isSeasonal ? 1 : 0);
  }
  if (typeof isFeatured === 'boolean') {
    where.push('p.is_featured = ?');
    params.push(isFeatured ? 1 : 0);
  }
  if (categorySlug) {
    join += ' INNER JOIN product_category pc ON pc.product_id = p.id INNER JOIN category c ON c.id = pc.category_id ';
    where.push('c.slug = ?');
    params.push(categorySlug);
  }
  if (q) {
    where.push('(p.name LIKE ? OR p.producer LIKE ? OR p.region LIKE ?)');
    const like = `%${q}%`;
    params.push(like, like, like);
  }

  return { whereSql: where.join(' AND '), params, join };
}

async function listActive(filters = {}) {
  const { whereSql, params, join } = buildFilters(filters);
  const sql = `
    SELECT DISTINCT p.* FROM product p ${join}
    WHERE ${whereSql}
    ORDER BY p.is_featured DESC, p.is_seasonal DESC, p.name ASC
  `;
  const rows = await query(sql, params);
  return rows.map(normalize);
}

async function paginate(filters = {}, { page = 1, size = 20 } = {}) {
  const { whereSql, params, join } = buildFilters(filters);
  const safePage = Math.max(1, Number(page) || 1);
  const safeSize = Math.min(50, Math.max(1, Number(size) || 20));
  const offset = (safePage - 1) * safeSize;

  const dataSql = `
    SELECT DISTINCT p.* FROM product p ${join}
    WHERE ${whereSql}
    ORDER BY p.is_featured DESC, p.is_seasonal DESC, p.name ASC
    LIMIT ? OFFSET ?
  `;
  const countSql = `
    SELECT COUNT(DISTINCT p.id) AS n FROM product p ${join}
    WHERE ${whereSql}
  `;

  const [rows, countRows] = await Promise.all([
    query(dataSql, [...params, safeSize, offset]),
    query(countSql, params),
  ]);

  const total = Number(countRows[0]?.n || 0);
  return {
    items: rows.map(normalize),
    pagination: {
      page: safePage,
      size: safeSize,
      total,
      total_pages: Math.max(1, Math.ceil(total / safeSize)),
    },
  };
}

async function findBySlug(slug) {
  const rows = await query('SELECT * FROM product WHERE slug = ? LIMIT 1', [slug]);
  return rows.length ? normalize(rows[0]) : null;
}

async function findActiveBySlug(slug) {
  const rows = await query('SELECT * FROM product WHERE slug = ? AND is_active = 1 LIMIT 1', [slug]);
  return rows.length ? normalize(rows[0]) : null;
}

async function findBySlugWithCategories(slug) {
  const product = await findBySlug(slug);
  if (!product) return null;
  const categories = await query(
    `SELECT c.id, c.slug, c.name, c.type, c.sort_order
     FROM category c
     INNER JOIN product_category pc ON pc.category_id = c.id
     WHERE pc.product_id = ?
     ORDER BY c.sort_order ASC`,
    [product.id],
  );
  return {
    ...product,
    categories: categories.map((c) => ({ ...c, id: Number(c.id) })),
  };
}

async function findById(id) {
  const rows = await query('SELECT * FROM product WHERE id = ? LIMIT 1', [id]);
  return rows.length ? normalize(rows[0]) : null;
}

async function listImages(productId) {
  const rows = await query(
    `SELECT id, url, alt_text, sort_order, is_primary FROM product_image
     WHERE product_id = ? ORDER BY is_primary DESC, sort_order ASC, id ASC`,
    [productId],
  );
  return rows.map((r) => ({
    ...r,
    id: Number(r.id),
    is_primary: !!r.is_primary,
    sort_order: Number(r.sort_order),
  }));
}

async function listVariantsByProduct(productId) {
  const rows = await query(
    'SELECT * FROM product_variant WHERE product_id = ? AND is_active = 1 ORDER BY sort_order ASC',
    [productId],
  );
  return rows.map((r) => ({
    ...r,
    id: Number(r.id),
    product_id: Number(r.product_id),
    is_alcohol: !!r.is_alcohol,
    is_active:  !!r.is_active,
    price_cents: Number(r.price_cents),
  }));
}

async function findVariantById(variantId) {
  const rows = await query(
    'SELECT * FROM product_variant WHERE id = ? LIMIT 1',
    [variantId],
  );
  if (!rows.length) return null;
  const v = rows[0];
  return {
    ...v,
    id: Number(v.id),
    product_id: Number(v.product_id),
    is_alcohol: !!v.is_alcohol,
    is_active: !!v.is_active,
    price_cents: Number(v.price_cents),
  };
}

/**
 * Resuelve productos activos por una lista mixta de ids/slugs en una sola
 * query. Devuelve un mapa `{ byId: Map<id, product>, bySlug: Map<slug, product> }`
 * con SOLO productos activos (`is_active=1`).
 */
async function findActiveByIdsOrSlugs({ ids = [], slugs = [] } = {}) {
  const cleanIds = [...new Set(ids.filter((v) => Number.isInteger(v) && v > 0))];
  const cleanSlugs = [...new Set(slugs.filter((s) => typeof s === 'string' && s.length))];
  if (!cleanIds.length && !cleanSlugs.length) {
    return { byId: new Map(), bySlug: new Map() };
  }

  const where = [];
  const params = [];
  if (cleanIds.length) {
    where.push(`id IN (${cleanIds.map(() => '?').join(',')})`);
    params.push(...cleanIds);
  }
  if (cleanSlugs.length) {
    where.push(`slug IN (${cleanSlugs.map(() => '?').join(',')})`);
    params.push(...cleanSlugs);
  }

  const rows = await query(
    `SELECT * FROM product WHERE is_active = 1 AND (${where.join(' OR ')})`,
    params,
  );
  const products = rows.map(normalize);
  const byId = new Map();
  const bySlug = new Map();
  for (const p of products) {
    byId.set(p.id, p);
    bySlug.set(p.slug, p);
  }
  return { byId, bySlug };
}

async function findVariantsByIdsOrSlugs({ ids = [], slugs = [] } = {}) {
  const cleanIds = [...new Set(ids.filter((v) => Number.isInteger(v) && v > 0))];
  const cleanSlugs = [...new Set(slugs.filter((s) => typeof s === 'string' && s.length))];
  if (!cleanIds.length && !cleanSlugs.length) {
    return { byId: new Map(), bySlug: new Map() };
  }

  const where = [];
  const params = [];
  if (cleanIds.length) {
    where.push(`id IN (${cleanIds.map(() => '?').join(',')})`);
    params.push(...cleanIds);
  }
  if (cleanSlugs.length) {
    where.push(`slug IN (${cleanSlugs.map(() => '?').join(',')})`);
    params.push(...cleanSlugs);
  }

  const rows = await query(
    `SELECT * FROM product_variant WHERE is_active = 1 AND (${where.join(' OR ')})`,
    params,
  );
  const byId = new Map();
  const bySlug = new Map();
  for (const v of rows) {
    const variant = {
      ...v,
      id: Number(v.id),
      product_id: Number(v.product_id),
      is_alcohol: !!v.is_alcohol,
      is_active: !!v.is_active,
      price_cents: Number(v.price_cents),
    };
    byId.set(variant.id, variant);
    bySlug.set(variant.slug, variant);
  }
  return { byId, bySlug };
}

// ── Admin operations ───────────────────────────────────────────────────────

async function adminPaginate({ page = 1, size = 20, type, isActive, stockStatus, q } = {}) {
  const where = ['1=1'];
  const params = [];

  if (type) { where.push('type = ?'); params.push(type); }
  if (typeof isActive === 'boolean') { where.push('is_active = ?'); params.push(isActive ? 1 : 0); }
  if (stockStatus) { where.push('stock_status = ?'); params.push(stockStatus); }
  if (q) {
    where.push('(name LIKE ? OR slug LIKE ? OR producer LIKE ?)');
    const like = `%${q}%`;
    params.push(like, like, like);
  }

  const safePage = Math.max(1, Number(page) || 1);
  const safeSize = Math.min(100, Math.max(1, Number(size) || 20));
  const offset = (safePage - 1) * safeSize;

  const dataSql = `SELECT * FROM product WHERE ${where.join(' AND ')} ORDER BY id DESC LIMIT ? OFFSET ?`;
  const countSql = `SELECT COUNT(*) AS n FROM product WHERE ${where.join(' AND ')}`;

  const [rows, countRows] = await Promise.all([
    query(dataSql, [...params, safeSize, offset]),
    query(countSql, params),
  ]);
  const total = Number(countRows[0]?.n || 0);
  return {
    items: rows.map(normalize),
    pagination: { page: safePage, size: safeSize, total, total_pages: Math.max(1, Math.ceil(total / safeSize)) },
  };
}

async function create(data) {
  const r = await query(
    `INSERT INTO product
      (slug, name, type, is_alcohol, price_cents, vat_rate, short_desc, long_desc,
       producer, region, milk_type, milk_treatment, intensity, pairing_notes,
       is_seasonal, is_featured, is_active, stock_status)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.slug, data.name, data.type,
      data.is_alcohol ? 1 : 0,
      Math.max(0, Number(data.price_cents) || 0),
      data.vat_rate !== undefined ? Number(data.vat_rate) : 10,
      data.short_desc || null, data.long_desc || null,
      data.producer || null, data.region || null,
      data.milk_type || null, data.milk_treatment || null,
      data.intensity || null, data.pairing_notes || null,
      data.is_seasonal ? 1 : 0,
      data.is_featured ? 1 : 0,
      data.is_active === false ? 0 : 1,
      data.stock_status || 'IN_STOCK',
    ],
  );
  return Number(r.insertId);
}

async function update(id, data) {
  const fields = [];
  const params = [];
  const COL_MAP = {
    name: 'name', slug: 'slug', type: 'type', is_alcohol: 'is_alcohol',
    price_cents: 'price_cents', vat_rate: 'vat_rate',
    short_desc: 'short_desc', long_desc: 'long_desc',
    producer: 'producer', region: 'region',
    milk_type: 'milk_type', milk_treatment: 'milk_treatment',
    intensity: 'intensity', pairing_notes: 'pairing_notes',
    is_seasonal: 'is_seasonal', is_featured: 'is_featured',
    is_active: 'is_active', stock_status: 'stock_status',
  };
  for (const [key, col] of Object.entries(COL_MAP)) {
    if (data[key] !== undefined) {
      fields.push(`${col} = ?`);
      let v = data[key];
      if (['is_alcohol', 'is_seasonal', 'is_featured', 'is_active'].includes(key)) v = v ? 1 : 0;
      params.push(v);
    }
  }
  if (!fields.length) return false;
  params.push(id);
  await query(`UPDATE product SET ${fields.join(', ')} WHERE id = ?`, params);
  return true;
}

async function setActive(id, isActive) {
  await query('UPDATE product SET is_active = ? WHERE id = ?', [isActive ? 1 : 0, id]);
}

async function setStockStatus(id, stockStatus) {
  await query('UPDATE product SET stock_status = ? WHERE id = ?', [stockStatus, id]);
}

async function existsSlug(slug, exceptId) {
  const rows = await query(
    'SELECT id FROM product WHERE slug = ? AND id <> ? LIMIT 1',
    [slug, exceptId || 0],
  );
  return rows.length > 0;
}

async function addImage({ productId, url, altText, sortOrder = 0, isPrimary = false }) {
  if (isPrimary) {
    await query('UPDATE product_image SET is_primary = 0 WHERE product_id = ?', [productId]);
  }
  const r = await query(
    `INSERT INTO product_image (product_id, url, alt_text, sort_order, is_primary)
     VALUES (?, ?, ?, ?, ?)`,
    [productId, url, altText || null, sortOrder, isPrimary ? 1 : 0],
  );
  return Number(r.insertId);
}

async function findImageById(id) {
  const rows = await query('SELECT * FROM product_image WHERE id = ? LIMIT 1', [id]);
  if (!rows.length) return null;
  return {
    ...rows[0],
    id: Number(rows[0].id),
    product_id: Number(rows[0].product_id),
    is_primary: !!rows[0].is_primary,
    sort_order: Number(rows[0].sort_order),
  };
}

async function deleteImage(id) {
  await query('DELETE FROM product_image WHERE id = ?', [id]);
}

module.exports = {
  listActive,
  paginate,
  findBySlug,
  findActiveBySlug,
  findBySlugWithCategories,
  findById,
  listImages,
  listVariantsByProduct,
  findVariantById,
  findActiveByIdsOrSlugs,
  findVariantsByIdsOrSlugs,
  // admin
  adminPaginate,
  create,
  update,
  setActive,
  setStockStatus,
  existsSlug,
  addImage,
  findImageById,
  deleteImage,
};
