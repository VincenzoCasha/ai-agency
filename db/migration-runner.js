'use strict';

/**
 * Migration runner para CRUDO V1.
 *
 * - Lee `db/migrations/*.sql` ordenados alfabeticamente.
 * - Mantiene una tabla `schema_migrations(name, applied_at)` para no reaplicar.
 * - Ejecuta cada archivo en una conexion (split por `;` simple, suficiente para
 *   nuestras migraciones que no contienen procedures con DELIMITER).
 *
 * Uso: ver `db/migrate.js` y `db/reset.js`.
 */

const fs = require('fs');
const path = require('path');
const mariadb = require('mariadb');
const env = require('../server/config/env');

const MIGRATIONS_DIR = path.join(__dirname, 'migrations');

function buildConnectionConfig({ database } = {}) {
  return {
    host: env.DB_HOST,
    port: env.DB_PORT,
    user: env.DB_USER,
    password: env.DB_PASSWORD,
    database: database || env.DB_NAME,
    multipleStatements: true,
    connectTimeout: 5000,
  };
}

async function withConnection(fn, opts = {}) {
  const conn = await mariadb.createConnection(buildConnectionConfig(opts));
  try {
    return await fn(conn);
  } finally {
    await conn.end();
  }
}

async function ensureSchemaMigrations(conn) {
  await conn.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      name        VARCHAR(255) NOT NULL,
      applied_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (name)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
}

function listMigrationFiles() {
  if (!fs.existsSync(MIGRATIONS_DIR)) return [];
  return fs
    .readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith('.sql'))
    .sort();
}

async function getAppliedMigrations(conn) {
  const rows = await conn.query('SELECT name FROM schema_migrations ORDER BY name');
  return new Set(rows.map((r) => r.name));
}

async function applyMigration(conn, fileName) {
  const fullPath = path.join(MIGRATIONS_DIR, fileName);
  const sql = fs.readFileSync(fullPath, 'utf8');
  // multipleStatements: true permite enviar todo el archivo en una sola query.
  await conn.query(sql);
  await conn.query('INSERT INTO schema_migrations (name) VALUES (?)', [fileName]);
}

async function runMigrations({ database, log = () => {} } = {}) {
  const files = listMigrationFiles();
  if (files.length === 0) {
    log('No hay archivos de migracion en db/migrations/.');
    return { applied: [], skipped: [] };
  }

  return withConnection(async (conn) => {
    await ensureSchemaMigrations(conn);
    const applied = await getAppliedMigrations(conn);

    const justApplied = [];
    const skipped = [];

    for (const file of files) {
      if (applied.has(file)) {
        skipped.push(file);
        log(`· skip ${file} (ya aplicada)`);
        continue;
      }
      log(`· apply ${file}`);
      await applyMigration(conn, file);
      justApplied.push(file);
    }

    return { applied: justApplied, skipped };
  }, { database });
}

async function dropAllTables({ database, log = () => {} } = {}) {
  return withConnection(async (conn) => {
    await conn.query('SET FOREIGN_KEY_CHECKS = 0');
    const dbName = database || env.DB_NAME;
    const rows = await conn.query(
      'SELECT TABLE_NAME AS name FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?',
      [dbName],
    );
    for (const row of rows) {
      log(`· drop ${row.name}`);
      await conn.query(`DROP TABLE IF EXISTS \`${row.name}\``);
    }
    await conn.query('SET FOREIGN_KEY_CHECKS = 1');
    return { dropped: rows.map((r) => r.name) };
  }, { database });
}

module.exports = {
  buildConnectionConfig,
  withConnection,
  runMigrations,
  dropAllTables,
  listMigrationFiles,
  ensureSchemaMigrations,
};
