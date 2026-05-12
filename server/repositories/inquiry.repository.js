'use strict';

const { query } = require('../../db/pool');

async function create({ type, name, email, phone, message, payload }) {
  const r = await query(
    `INSERT INTO inquiry (type, name, email, phone, message, payload_json, status)
     VALUES (?, ?, ?, ?, ?, ?, 'NEW')`,
    [
      type, name, email, phone || null, message || null,
      payload ? JSON.stringify(payload) : null,
    ],
  );
  return Number(r.insertId);
}

async function adminPaginate({ page = 1, size = 20, status, type, q } = {}) {
  const where = []; const params = [];
  if (status) { where.push('status = ?'); params.push(status); }
  if (type)   { where.push('type = ?');   params.push(type); }
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
    `SELECT * FROM inquiry ${whereSql} ORDER BY id DESC LIMIT ? OFFSET ?`,
    [...params, safeSize, offset],
  );
  const countRows = await query(`SELECT COUNT(*) AS n FROM inquiry ${whereSql}`, params);
  const total = Number(countRows[0]?.n || 0);
  return {
    items: rows.map((r) => ({ ...r, id: Number(r.id) })),
    pagination: { page: safePage, size: safeSize, total, total_pages: Math.max(1, Math.ceil(total / safeSize)) },
  };
}

async function findById(id) {
  const rows = await query('SELECT * FROM inquiry WHERE id = ? LIMIT 1', [id]);
  if (!rows.length) return null;
  return { ...rows[0], id: Number(rows[0].id) };
}

async function updateStatus(id, status) {
  await query('UPDATE inquiry SET status = ? WHERE id = ?', [status, id]);
}

async function countByStatus(status) {
  const rows = await query('SELECT COUNT(*) AS n FROM inquiry WHERE status = ?', [status]);
  return Number(rows[0]?.n || 0);
}

module.exports = { create, adminPaginate, findById, updateStatus, countByStatus };
