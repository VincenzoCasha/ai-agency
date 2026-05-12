'use strict';

/**
 * Idempotency service.
 *
 *  - Hashea payloads de forma estable (orden alfabetico de claves) con SHA-256.
 *  - Persiste por `Idempotency-Key`: misma key + mismo hash => mismo response.
 *  - Misma key + hash distinto => 409 Conflict (lo decide el caller).
 *  - Las claves expiran a 24h por contrato V1.
 */

const crypto = require('crypto');
const repo = require('../repositories/idempotency.repository');

const TWENTY_FOUR_HOURS_MS = 24 * 60 * 60 * 1000;

function stableStringify(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((k) => JSON.stringify(k) + ':' + stableStringify(value[k])).join(',')}}`;
}

function hashPayload(payload) {
  return crypto.createHash('sha256').update(stableStringify(payload || {})).digest('hex');
}

function expiresIn(ms = TWENTY_FOUR_HOURS_MS) {
  return new Date(Date.now() + ms);
}

async function lookup(keyValue) {
  if (!keyValue) return null;
  const row = await repo.findByKey(keyValue);
  if (!row) return null;
  if (row.expires_at && new Date(row.expires_at).getTime() < Date.now()) {
    // Caducada — la borramos para permitir un nuevo request limpio.
    await repo.deleteByKey(keyValue);
    return null;
  }
  let parsed = null;
  try {
    parsed = JSON.parse(row.response_json);
  } catch {
    parsed = null;
  }
  return {
    keyValue: row.key_value,
    requestHash: row.request_hash,
    statusCode: row.status_code,
    response: parsed,
    resourceType: row.resource_type,
    resourceId: row.resource_id,
  };
}

async function persist({ keyValue, requestHash, statusCode, response, resourceType, resourceId }) {
  if (!keyValue) return;
  await repo.save({
    keyValue,
    requestHash,
    statusCode,
    responseJson: JSON.stringify(response),
    resourceType,
    resourceId,
    expiresAt: expiresIn(),
  });
}

module.exports = {
  hashPayload,
  stableStringify,
  lookup,
  persist,
  TWENTY_FOUR_HOURS_MS,
};
