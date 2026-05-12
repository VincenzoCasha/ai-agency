'use strict';

const { query } = require('../../db/pool');

function normalize(row) {
  if (!row) return null;
  return {
    ...row,
    id: Number(row.id),
    is_active: !!row.is_active,
  };
}

async function findActiveCampaign() {
  const rows = await query(
    `SELECT * FROM campaign
     WHERE is_active = 1
       AND (starts_at IS NULL OR starts_at <= CURRENT_TIMESTAMP)
       AND (ends_at   IS NULL OR ends_at   >= CURRENT_TIMESTAMP)
     ORDER BY starts_at DESC
     LIMIT 1`,
  );
  return rows.length ? normalize(rows[0]) : null;
}

async function findActiveBySlug(slug) {
  const rows = await query(
    `SELECT * FROM campaign
     WHERE slug = ? AND is_active = 1
       AND (starts_at IS NULL OR starts_at <= CURRENT_TIMESTAMP)
       AND (ends_at   IS NULL OR ends_at   >= CURRENT_TIMESTAMP)
     LIMIT 1`,
    [slug],
  );
  return rows.length ? normalize(rows[0]) : null;
}

async function listProducts(campaignId) {
  const rows = await query(
    `SELECT p.*, cp.sort_order AS campaign_sort
     FROM product p
     INNER JOIN campaign_product cp ON cp.product_id = p.id
     WHERE cp.campaign_id = ? AND p.is_active = 1
     ORDER BY cp.sort_order ASC, p.name ASC`,
    [campaignId],
  );
  return rows.map((p) => ({
    ...p,
    id: Number(p.id),
    is_alcohol: !!p.is_alcohol,
    is_seasonal: !!p.is_seasonal,
    is_featured: !!p.is_featured,
    is_active: !!p.is_active,
    price_cents: Number(p.price_cents),
    vat_rate: p.vat_rate !== null && p.vat_rate !== undefined ? Number(p.vat_rate) : null,
  }));
}

// ── Admin operations ───────────────────────────────────────────────────────

async function adminPaginate({ page = 1, size = 20, isActive, q } = {}) {
  const where = ['1=1']; const params = [];
  if (typeof isActive === 'boolean') { where.push('is_active = ?'); params.push(isActive ? 1 : 0); }
  if (q) {
    where.push('(title LIKE ? OR slug LIKE ?)');
    const like = `%${q}%`;
    params.push(like, like);
  }
  const safePage = Math.max(1, Number(page) || 1);
  const safeSize = Math.min(100, Math.max(1, Number(size) || 20));
  const offset = (safePage - 1) * safeSize;
  const rows = await query(
    `SELECT * FROM campaign WHERE ${where.join(' AND ')} ORDER BY id DESC LIMIT ? OFFSET ?`,
    [...params, safeSize, offset],
  );
  const countRows = await query(`SELECT COUNT(*) AS n FROM campaign WHERE ${where.join(' AND ')}`, params);
  const total = Number(countRows[0]?.n || 0);
  return {
    items: rows.map(normalize),
    pagination: { page: safePage, size: safeSize, total, total_pages: Math.max(1, Math.ceil(total / safeSize)) },
  };
}

async function findById(id) {
  const rows = await query('SELECT * FROM campaign WHERE id = ? LIMIT 1', [id]);
  return rows.length ? normalize(rows[0]) : null;
}

async function existsSlug(slug, exceptId) {
  const rows = await query('SELECT id FROM campaign WHERE slug = ? AND id <> ? LIMIT 1', [slug, exceptId || 0]);
  return rows.length > 0;
}

async function create(data) {
  const r = await query(
    `INSERT INTO campaign (slug, title, subtitle, hero_image_url, body_md, starts_at, ends_at, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.slug, data.title, data.subtitle || null, data.hero_image_url || null,
      data.body_md || null, data.starts_at || null, data.ends_at || null,
      data.is_active === false ? 0 : 1,
    ],
  );
  return Number(r.insertId);
}

async function update(id, data) {
  const fields = []; const params = [];
  const COL_MAP = {
    title: 'title', slug: 'slug', subtitle: 'subtitle',
    hero_image_url: 'hero_image_url', body_md: 'body_md',
    starts_at: 'starts_at', ends_at: 'ends_at', is_active: 'is_active',
  };
  for (const [k, col] of Object.entries(COL_MAP)) {
    if (data[k] !== undefined) {
      fields.push(`${col} = ?`);
      let v = data[k];
      if (k === 'is_active') v = v ? 1 : 0;
      params.push(v);
    }
  }
  if (!fields.length) return false;
  params.push(id);
  await query(`UPDATE campaign SET ${fields.join(', ')} WHERE id = ?`, params);
  return true;
}

async function setActive(id, isActive) {
  await query('UPDATE campaign SET is_active = ? WHERE id = ?', [isActive ? 1 : 0, id]);
}

async function setProducts(campaignId, productIds = []) {
  await query('DELETE FROM campaign_product WHERE campaign_id = ?', [campaignId]);
  let order = 0;
  for (const pid of productIds) {
    await query(
      'INSERT INTO campaign_product (campaign_id, product_id, sort_order) VALUES (?, ?, ?)',
      [campaignId, Number(pid), order++],
    );
  }
}

async function countActiveOthers(exceptId) {
  const rows = await query(
    `SELECT COUNT(*) AS n FROM campaign
     WHERE is_active = 1 AND id <> ?
       AND (starts_at IS NULL OR starts_at <= CURRENT_TIMESTAMP)
       AND (ends_at   IS NULL OR ends_at   >= CURRENT_TIMESTAMP)`,
    [exceptId || 0],
  );
  return Number(rows[0]?.n || 0);
}

module.exports = {
  findActiveCampaign,
  findActiveBySlug,
  listProducts,
  // admin
  adminPaginate,
  findById,
  existsSlug,
  create,
  update,
  setActive,
  setProducts,
  countActiveOthers,
};
