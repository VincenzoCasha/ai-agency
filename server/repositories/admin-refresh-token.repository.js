'use strict';

const { query } = require('../../db/pool');

async function create({ adminUserId, tokenHash, ipHash, userAgentHash, expiresAt }) {
  const r = await query(
    `INSERT INTO admin_refresh_token
       (admin_user_id, token_hash, ip_hash, user_agent_hash, expires_at)
     VALUES (?, ?, ?, ?, ?)`,
    [adminUserId, tokenHash, ipHash || null, userAgentHash || null, expiresAt],
  );
  return Number(r.insertId);
}

async function findActiveByHash(tokenHash) {
  const rows = await query(
    `SELECT * FROM admin_refresh_token
     WHERE token_hash = ? AND revoked_at IS NULL AND expires_at > CURRENT_TIMESTAMP
     LIMIT 1`,
    [tokenHash],
  );
  if (!rows.length) return null;
  const r = rows[0];
  return {
    id: Number(r.id),
    admin_user_id: Number(r.admin_user_id),
    token_hash: r.token_hash,
    ip_hash: r.ip_hash,
    user_agent_hash: r.user_agent_hash,
    expires_at: r.expires_at,
    revoked_at: r.revoked_at,
    created_at: r.created_at,
  };
}

async function revokeByHash(tokenHash) {
  await query(
    `UPDATE admin_refresh_token
       SET revoked_at = CURRENT_TIMESTAMP
     WHERE token_hash = ? AND revoked_at IS NULL`,
    [tokenHash],
  );
}

async function revokeAllForAdmin(adminUserId) {
  await query(
    `UPDATE admin_refresh_token
       SET revoked_at = CURRENT_TIMESTAMP
     WHERE admin_user_id = ? AND revoked_at IS NULL`,
    [adminUserId],
  );
}

module.exports = { create, findActiveByHash, revokeByHash, revokeAllForAdmin };
