'use strict';

const { query } = require('../../db/pool');

function normalize(row) {
  return {
    ...row,
    id: Number(row.id),
    capacity: Number(row.capacity),
    price_cents: Number(row.price_cents),
    is_active: !!row.is_active,
  };
}

async function listUpcomingActive({ limit = 50 } = {}) {
  const rows = await query(
    `SELECT * FROM event
     WHERE is_active = 1 AND starts_at >= CURRENT_TIMESTAMP
     ORDER BY starts_at ASC
     LIMIT ?`,
    [limit],
  );
  return rows.map(normalize);
}

async function findBySlug(slug) {
  const rows = await query('SELECT * FROM event WHERE slug = ? LIMIT 1', [slug]);
  return rows.length ? normalize(rows[0]) : null;
}

async function findActiveUpcomingBySlug(slug) {
  const rows = await query(
    `SELECT * FROM event
     WHERE slug = ? AND is_active = 1 AND starts_at >= CURRENT_TIMESTAMP
     LIMIT 1`,
    [slug],
  );
  return rows.length ? normalize(rows[0]) : null;
}

/**
 * Suma de party_size de reservas activas (NEW + CONFIRMED).
 * Usado para calcular plazas restantes.
 */
async function countSeatsTaken(eventId) {
  const rows = await query(
    `SELECT COALESCE(SUM(party_size), 0) AS taken
     FROM event_reservation
     WHERE event_id = ? AND status IN ('NEW','CONFIRMED')`,
    [eventId],
  );
  return Number(rows[0]?.taken || 0);
}

async function createReservation({ eventId, name, email, phone, partySize, notes }) {
  const r = await query(
    `INSERT INTO event_reservation (event_id, name, email, phone, party_size, notes, status)
     VALUES (?, ?, ?, ?, ?, ?, 'NEW')`,
    [eventId, name, email, phone || null, partySize, notes || null],
  );
  return Number(r.insertId);
}

// ── Admin operations ───────────────────────────────────────────────────────

async function adminPaginate({ page = 1, size = 20, isActive, q, includePast = true } = {}) {
  const where = ['1=1'];
  const params = [];
  if (typeof isActive === 'boolean') { where.push('is_active = ?'); params.push(isActive ? 1 : 0); }
  if (!includePast) { where.push('starts_at >= CURRENT_TIMESTAMP'); }
  if (q) {
    where.push('(title LIKE ? OR slug LIKE ? OR location LIKE ?)');
    const like = `%${q}%`;
    params.push(like, like, like);
  }

  const safePage = Math.max(1, Number(page) || 1);
  const safeSize = Math.min(100, Math.max(1, Number(size) || 20));
  const offset = (safePage - 1) * safeSize;
  const dataSql = `SELECT * FROM event WHERE ${where.join(' AND ')} ORDER BY starts_at DESC LIMIT ? OFFSET ?`;
  const countSql = `SELECT COUNT(*) AS n FROM event WHERE ${where.join(' AND ')}`;
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

async function findById(id) {
  const rows = await query('SELECT * FROM event WHERE id = ? LIMIT 1', [id]);
  return rows.length ? normalize(rows[0]) : null;
}

async function existsSlug(slug, exceptId) {
  const rows = await query(
    'SELECT id FROM event WHERE slug = ? AND id <> ? LIMIT 1',
    [slug, exceptId || 0],
  );
  return rows.length > 0;
}

async function create(data) {
  const r = await query(
    `INSERT INTO event
       (slug, title, description_md, hero_image_url, starts_at, ends_at,
        capacity, price_cents, location, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.slug, data.title, data.description_md || null, data.hero_image_url || null,
      data.starts_at, data.ends_at || null,
      Math.max(0, Number(data.capacity) || 0),
      Math.max(0, Number(data.price_cents) || 0),
      data.location || null,
      data.is_active === false ? 0 : 1,
    ],
  );
  return Number(r.insertId);
}

async function update(id, data) {
  const fields = []; const params = [];
  const COL_MAP = {
    title: 'title', slug: 'slug', description_md: 'description_md',
    hero_image_url: 'hero_image_url', starts_at: 'starts_at', ends_at: 'ends_at',
    capacity: 'capacity', price_cents: 'price_cents', location: 'location', is_active: 'is_active',
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
  await query(`UPDATE event SET ${fields.join(', ')} WHERE id = ?`, params);
  return true;
}

async function setActive(id, isActive) {
  await query('UPDATE event SET is_active = ? WHERE id = ?', [isActive ? 1 : 0, id]);
}

// Reservas admin
async function listReservationsForAdmin({ eventId, status, page = 1, size = 20 } = {}) {
  const where = []; const params = [];
  if (eventId) { where.push('event_id = ?'); params.push(Number(eventId)); }
  if (status) { where.push('status = ?'); params.push(status); }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const safePage = Math.max(1, Number(page) || 1);
  const safeSize = Math.min(100, Math.max(1, Number(size) || 20));
  const offset = (safePage - 1) * safeSize;
  const rows = await query(
    `SELECT * FROM event_reservation ${whereSql} ORDER BY id DESC LIMIT ? OFFSET ?`,
    [...params, safeSize, offset],
  );
  const countRows = await query(`SELECT COUNT(*) AS n FROM event_reservation ${whereSql}`, params);
  const total = Number(countRows[0]?.n || 0);
  return {
    items: rows.map((r) => ({
      ...r,
      id: Number(r.id),
      event_id: Number(r.event_id),
      party_size: Number(r.party_size),
    })),
    pagination: { page: safePage, size: safeSize, total, total_pages: Math.max(1, Math.ceil(total / safeSize)) },
  };
}

async function findReservationById(id) {
  const rows = await query('SELECT * FROM event_reservation WHERE id = ? LIMIT 1', [id]);
  if (!rows.length) return null;
  const r = rows[0];
  return { ...r, id: Number(r.id), event_id: Number(r.event_id), party_size: Number(r.party_size) };
}

async function updateReservationStatus(id, status) {
  await query('UPDATE event_reservation SET status = ? WHERE id = ?', [status, id]);
}

module.exports = {
  listUpcomingActive,
  findBySlug,
  findActiveUpcomingBySlug,
  countSeatsTaken,
  createReservation,
  // admin
  adminPaginate,
  findById,
  existsSlug,
  create,
  update,
  setActive,
  listReservationsForAdmin,
  findReservationById,
  updateReservationStatus,
};
