'use strict';

const auditRepo = require('../repositories/audit-log.repository');

const REDACT_KEYS = new Set([
  'password', 'password_hash', 'token', 'access_token', 'refresh_token',
  'authorization', 'cookie', 'set-cookie',
]);

function sanitize(obj) {
  if (obj === null || obj === undefined) return obj;
  if (Array.isArray(obj)) return obj.map(sanitize);
  if (typeof obj !== 'object') return obj;
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    if (REDACT_KEYS.has(k.toLowerCase())) {
      out[k] = '[REDACTED]';
    } else if (typeof v === 'string' && v.length > 500) {
      out[k] = `${v.slice(0, 500)}…`;
    } else {
      out[k] = sanitize(v);
    }
  }
  return out;
}

async function log({ actorAdminUserId, action, entityType, entityId, payload }) {
  return auditRepo.create({
    actorAdminUserId,
    action,
    entityType,
    entityId,
    payload: payload ? sanitize(payload) : null,
  });
}

async function listRecent(opts) {
  return auditRepo.listRecent(opts);
}

module.exports = { log, sanitize, listRecent };
