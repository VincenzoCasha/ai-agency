'use strict';

const { query } = require('../../db/pool');

async function findByKey(keyValue) {
  const rows = await query(
    'SELECT * FROM idempotency_key WHERE key_value = ? LIMIT 1',
    [keyValue],
  );
  if (!rows.length) return null;
  const row = rows[0];
  return {
    key_value: row.key_value,
    request_hash: row.request_hash,
    status_code: Number(row.status_code),
    response_json: row.response_json,
    resource_type: row.resource_type,
    resource_id: row.resource_id !== null ? Number(row.resource_id) : null,
    expires_at: row.expires_at,
    created_at: row.created_at,
  };
}

async function save({ keyValue, requestHash, statusCode, responseJson, resourceType, resourceId, expiresAt }) {
  await query(
    `INSERT INTO idempotency_key
       (key_value, request_hash, status_code, response_json, resource_type, resource_id, expires_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      keyValue,
      requestHash,
      statusCode,
      typeof responseJson === 'string' ? responseJson : JSON.stringify(responseJson),
      resourceType || null,
      resourceId || null,
      expiresAt,
    ],
  );
}

async function deleteByKey(keyValue) {
  await query('DELETE FROM idempotency_key WHERE key_value = ?', [keyValue]);
}

module.exports = { findByKey, save, deleteByKey };
