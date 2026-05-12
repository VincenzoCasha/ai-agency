'use strict';

const siteRepo = require('../repositories/site-config.repository');
const audit = require('./audit.service');
const { AdminError } = require('./admin-product.service');

const ALLOWED_KEYS = new Set([
  'pickup_paused',
  'pickup_daily_capacity',
  'pickup_open_message',
]);

function asString(value) {
  if (value === null || value === undefined) return null;
  if (typeof value === 'boolean') return value ? 'true' : 'false';
  return String(value);
}

async function getAll() {
  return siteRepo.getAll();
}

async function update(adminId, partial) {
  const sanitized = {};
  for (const [k, v] of Object.entries(partial || {})) {
    if (!ALLOWED_KEYS.has(k)) {
      throw new AdminError(
        422,
        'CONFIG_KEY_NOT_ALLOWED',
        `La clave '${k}' no es modificable desde el admin.`,
        { allowed_keys: [...ALLOWED_KEYS] },
      );
    }
    sanitized[k] = asString(v);
  }
  await siteRepo.bulkSet(sanitized);
  await audit.log({
    actorAdminUserId: adminId,
    action: 'site_config.update',
    entityType: 'site_config',
    payload: { keys: Object.keys(sanitized) },
  });
  return getAll();
}

module.exports = { getAll, update, ALLOWED_KEYS };
