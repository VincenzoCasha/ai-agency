'use strict';

/**
 * pickup-order repository.
 *
 * `createWithItems` envuelve el INSERT del pedido + items en una transaccion
 * usando una conexion dedicada del pool, garantizando que un fallo en cualquier
 * item revierte el pedido entero (regla obligatoria Fase 4).
 */

const mariadb = require('mariadb');
const { getPool, query } = require('../../db/pool');

async function createWithItems({ order, items }) {
  const conn = await getPool().getConnection();
  try {
    await conn.beginTransaction();

    const r = await conn.query(
      `INSERT INTO pickup_order
         (name, email, phone, pickup_date, pickup_slot, notes, total_cents, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'NEW')`,
      [order.name, order.email, order.phone, order.pickup_date, order.pickup_slot, order.notes || null, order.total_cents],
    );
    const orderId = Number(r.insertId);

    for (const item of items) {
      await conn.query(
        `INSERT INTO pickup_order_item
           (pickup_order_id, product_id, variant_id, qty, unit_price_cents)
         VALUES (?, ?, ?, ?, ?)`,
        [orderId, item.product_id, item.variant_id || null, item.qty, item.unit_price_cents],
      );
    }

    await conn.commit();
    return orderId;
  } catch (err) {
    try { await conn.rollback(); } catch { /* ignore */ }
    if (err instanceof mariadb.SqlError) {
      throw err;
    }
    throw err;
  } finally {
    conn.release();
  }
}

async function findById(id) {
  const rows = await query('SELECT * FROM pickup_order WHERE id = ? LIMIT 1', [id]);
  if (!rows.length) return null;
  const o = rows[0];
  return {
    ...o,
    id: Number(o.id),
    total_cents: Number(o.total_cents),
  };
}

async function listItems(orderId) {
  const rows = await query(
    `SELECT id, product_id, variant_id, qty, unit_price_cents
     FROM pickup_order_item WHERE pickup_order_id = ? ORDER BY id ASC`,
    [orderId],
  );
  return rows.map((r) => ({
    id: Number(r.id),
    product_id: Number(r.product_id),
    variant_id: r.variant_id !== null ? Number(r.variant_id) : null,
    qty: Number(r.qty),
    unit_price_cents: Number(r.unit_price_cents),
  }));
}

async function adminPaginate({ page = 1, size = 20, status, fromDate, toDate, q } = {}) {
  const where = []; const params = [];
  if (status) { where.push('status = ?'); params.push(status); }
  if (fromDate) { where.push('pickup_date >= ?'); params.push(fromDate); }
  if (toDate) { where.push('pickup_date <= ?'); params.push(toDate); }
  if (q) {
    where.push('(name LIKE ? OR email LIKE ? OR phone LIKE ?)');
    const like = `%${q}%`;
    params.push(like, like, like);
  }
  const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : '';
  const safePage = Math.max(1, Number(page) || 1);
  const safeSize = Math.min(100, Math.max(1, Number(size) || 20));
  const offset = (safePage - 1) * safeSize;
  const rows = await query(
    `SELECT * FROM pickup_order ${whereSql}
     ORDER BY pickup_date DESC, pickup_slot DESC, id DESC LIMIT ? OFFSET ?`,
    [...params, safeSize, offset],
  );
  const countRows = await query(`SELECT COUNT(*) AS n FROM pickup_order ${whereSql}`, params);
  const total = Number(countRows[0]?.n || 0);
  return {
    items: rows.map((r) => ({ ...r, id: Number(r.id), total_cents: Number(r.total_cents) })),
    pagination: { page: safePage, size: safeSize, total, total_pages: Math.max(1, Math.ceil(total / safeSize)) },
  };
}

async function updateStatus(id, status) {
  await query('UPDATE pickup_order SET status = ? WHERE id = ?', [status, id]);
}

/**
 * KPIs y bloques del dashboard owner.
 */
async function listForToday({ limit = 20 } = {}) {
  const rows = await query(
    `SELECT * FROM pickup_order
     WHERE pickup_date = CURDATE()
     ORDER BY pickup_slot ASC, id ASC
     LIMIT ?`,
    [Math.min(50, limit)],
  );
  return rows.map((r) => ({ ...r, id: Number(r.id), total_cents: Number(r.total_cents) }));
}

async function listUpcomingNew({ limit = 20 } = {}) {
  const rows = await query(
    `SELECT * FROM pickup_order
     WHERE status = 'NEW' AND pickup_date >= CURDATE()
     ORDER BY pickup_date ASC, pickup_slot ASC, id ASC
     LIMIT ?`,
    [Math.min(50, limit)],
  );
  return rows.map((r) => ({ ...r, id: Number(r.id), total_cents: Number(r.total_cents) }));
}

async function countByStatusInPeriod({ status, from, to }) {
  const rows = await query(
    'SELECT COUNT(*) AS n, COALESCE(SUM(total_cents),0) AS revenue FROM pickup_order WHERE status = ? AND created_at BETWEEN ? AND ?',
    [status, from, to],
  );
  return { count: Number(rows[0]?.n || 0), revenue_cents: Number(rows[0]?.revenue || 0) };
}

module.exports = {
  createWithItems,
  findById,
  listItems,
  adminPaginate,
  updateStatus,
  listForToday,
  listUpcomingNew,
  countByStatusInPeriod,
};
