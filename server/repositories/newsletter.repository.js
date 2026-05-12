'use strict';

const { query } = require('../../db/pool');

async function findByEmail(email) {
  const rows = await query('SELECT * FROM newsletter_subscriber WHERE email = ? LIMIT 1', [email]);
  return rows.length ? rows[0] : null;
}

/**
 * Upsert por email. Si existe y esta UNSUBSCRIBED, lo reactiva.
 * Devuelve `{ id, status, created }` donde `created` indica si la fila es nueva.
 */
async function upsertActive({ email, source, ip }) {
  const existing = await findByEmail(email);
  if (existing) {
    await query(
      `UPDATE newsletter_subscriber
         SET status = 'ACTIVE',
             source = COALESCE(?, source),
             ip = COALESCE(?, ip),
             consent_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [source || null, ip || null, existing.id],
    );
    return { id: Number(existing.id), status: 'ACTIVE', created: false };
  }

  const r = await query(
    `INSERT INTO newsletter_subscriber (email, source, status, consent_at, ip)
     VALUES (?, ?, 'ACTIVE', CURRENT_TIMESTAMP, ?)`,
    [email, source || null, ip || null],
  );
  return { id: Number(r.insertId), status: 'ACTIVE', created: true };
}

module.exports = { findByEmail, upsertActive };
