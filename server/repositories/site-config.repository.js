'use strict';

const { query } = require('../../db/pool');

async function getAll() {
  const rows = await query('SELECT config_key, value_text FROM site_config');
  const out = {};
  for (const r of rows) out[r.config_key] = r.value_text;
  return out;
}

async function get(key) {
  const rows = await query('SELECT value_text FROM site_config WHERE config_key = ? LIMIT 1', [key]);
  return rows.length ? rows[0].value_text : null;
}

async function set(key, value) {
  await query(
    `INSERT INTO site_config (config_key, value_text) VALUES (?, ?)
     ON DUPLICATE KEY UPDATE value_text = VALUES(value_text)`,
    [key, value],
  );
}

async function bulkSet(map = {}) {
  for (const [key, value] of Object.entries(map)) {
    await set(key, value === null || value === undefined ? null : String(value));
  }
}

module.exports = { getAll, get, set, bulkSet };
