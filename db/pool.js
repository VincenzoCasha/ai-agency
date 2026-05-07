'use strict';

const mariadb = require('mariadb');
const env = require('../server/config/env');

let pool = null;

function getPool() {
  if (!pool) {
    pool = mariadb.createPool({
      host: env.DB_HOST,
      port: env.DB_PORT,
      database: env.DB_NAME,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      connectionLimit: 10,
      connectTimeout: 5000,
    });
  }
  return pool;
}

async function query(sql, params) {
  const conn = await getPool().getConnection();
  try {
    return await conn.query(sql, params);
  } finally {
    conn.release();
  }
}

async function pingDatabase() {
  const conn = await getPool().getConnection();
  try {
    await conn.ping();
  } finally {
    conn.release();
  }
}

async function closePool() {
  if (pool) {
    await pool.end();
    pool = null;
  }
}

module.exports = { getPool, query, pingDatabase, closePool };
