'use strict';

const { query } = require('../../db/pool');

function normalize(row) {
  return { ...row, id: Number(row.id), sort_order: Number(row.sort_order) };
}

async function listAll({ type } = {}) {
  const where = [];
  const params = [];
  if (type) {
    where.push('type = ?');
    params.push(type);
  }
  const sql = `SELECT * FROM category ${where.length ? 'WHERE ' + where.join(' AND ') : ''} ORDER BY sort_order ASC`;
  const rows = await query(sql, params);
  return rows.map(normalize);
}

async function findBySlug(slug) {
  const rows = await query('SELECT * FROM category WHERE slug = ? LIMIT 1', [slug]);
  return rows.length ? normalize(rows[0]) : null;
}

module.exports = { listAll, findBySlug };
