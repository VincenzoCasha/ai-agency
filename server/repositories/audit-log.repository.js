'use strict';

const { query } = require('../../db/pool');

async function create({ actorAdminUserId, action, entityType, entityId, payload }) {
  const r = await query(
    `INSERT INTO audit_log
       (actor_admin_user_id, action, entity_type, entity_id, payload_json)
     VALUES (?, ?, ?, ?, ?)`,
    [
      actorAdminUserId || null,
      action,
      entityType,
      entityId || null,
      payload ? JSON.stringify(payload) : null,
    ],
  );
  return Number(r.insertId);
}

async function listRecent({ limit = 50 } = {}) {
  const rows = await query(
    `SELECT * FROM audit_log ORDER BY id DESC LIMIT ?`,
    [Math.min(200, Math.max(1, Number(limit) || 50))],
  );
  return rows.map((r) => ({
    id: Number(r.id),
    actor_admin_user_id: r.actor_admin_user_id !== null ? Number(r.actor_admin_user_id) : null,
    action: r.action,
    entity_type: r.entity_type,
    entity_id: r.entity_id !== null ? Number(r.entity_id) : null,
    payload_json: r.payload_json,
    created_at: r.created_at,
  }));
}

module.exports = { create, listRecent };
