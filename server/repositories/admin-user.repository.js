'use strict';

const { query } = require('../../db/pool');

function normalize(row) {
  if (!row) return null;
  return {
    id: Number(row.id),
    email: row.email,
    password_hash: row.password_hash,
    role: row.role,
    is_active: !!row.is_active,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

async function findActiveByEmail(email) {
  const rows = await query(
    `SELECT id, email, password_hash, role, is_active, created_at, updated_at
     FROM admin_user WHERE LOWER(email) = LOWER(?) AND is_active = 1 LIMIT 1`,
    [email],
  );
  return rows.length ? normalize(rows[0]) : null;
}

async function findById(id) {
  const rows = await query(
    `SELECT id, email, password_hash, role, is_active, created_at, updated_at
     FROM admin_user WHERE id = ? LIMIT 1`,
    [id],
  );
  return rows.length ? normalize(rows[0]) : null;
}

module.exports = { findActiveByEmail, findById };
