/**
 * Helper de tests que necesitan MariaDB real.
 *
 * - Resuelve el nombre de la DB de test (`DB_TEST_NAME` o `crudo_test`).
 * - Detecta si MariaDB esta disponible y devuelve `available=false` sin tirar
 *   los tests; los tests deciden hacer skip con mensaje claro.
 * - Reusa el migration-runner para preparar el schema desde cero.
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const mariadb = require('mariadb');
const env = require('../../server/config/env.js');
const { runMigrations, dropAllTables, withConnection } = require('../../db/migration-runner.js');
const { seedDatabase } = require('../../db/seeds/dev-seed.js');
export { withConnection };

export const TEST_DB = process.env.DB_TEST_NAME || 'crudo_test';

let availability = null;

export async function checkAvailability() {
  if (availability !== null) return availability;
  let conn;
  try {
    conn = await mariadb.createConnection({
      host: env.DB_HOST,
      port: env.DB_PORT,
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      database: TEST_DB,
      connectTimeout: 1500,
    });
    await conn.ping();
    availability = { available: true, reason: null };
  } catch (err) {
    availability = {
      available: false,
      reason: `MariaDB no disponible para tests (DB=${TEST_DB} user=${env.DB_USER}): ${err.code || err.message}`,
    };
  } finally {
    if (conn) await conn.end();
  }
  return availability;
}

export async function resetTestDatabase() {
  await dropAllTables({ database: TEST_DB });
  await runMigrations({ database: TEST_DB });
}

export async function seedTestDatabase() {
  await withConnection(async (conn) => {
    await seedDatabase(conn);
  }, { database: TEST_DB });
}
