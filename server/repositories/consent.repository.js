'use strict';

const { query } = require('../../db/pool');

async function create({ consentId, analytics, marketing, preferences, ipHash, userAgentHash, expiresAt }) {
  const r = await query(
    `INSERT INTO consent_log
     (consent_id, analytics, marketing, preferences, ip_hash, user_agent_hash, expires_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      consentId,
      analytics ? 1 : 0,
      marketing ? 1 : 0,
      preferences ? 1 : 0,
      ipHash || null,
      userAgentHash || null,
      expiresAt,
    ],
  );
  return Number(r.insertId);
}

async function findById(id) {
  const rows = await query('SELECT * FROM consent_log WHERE id = ? LIMIT 1', [id]);
  return rows.length ? rows[0] : null;
}

module.exports = { create, findById };
