#!/usr/bin/env node
'use strict';

/**
 * CLI: ejecuta el seed de desarrollo (`db/seeds/dev-seed.js`).
 *
 * Aborta si NODE_ENV=production. Usa la conexion configurada en `.env`,
 * con override opcional `--database=<name>` o `DB_OVERRIDE`.
 */

const env = require('../server/config/env');
const { withConnection } = require('./migration-runner');
const { seedDatabase } = require('./seeds/dev-seed');

function parseDbArg() {
  const arg = process.argv.find((a) => a.startsWith('--database='));
  if (arg) return arg.split('=')[1];
  return process.env.DB_OVERRIDE || undefined;
}

async function main() {
  if (env.NODE_ENV === 'production') {
    process.stderr.write('[db:seed] ABORT: prohibido en NODE_ENV=production\n');
    process.exit(1);
  }
  if (env.NODE_ENV !== 'development' && env.NODE_ENV !== 'test') {
    process.stderr.write(`[db:seed] ABORT: NODE_ENV=${env.NODE_ENV} no permitido (solo development/test)\n`);
    process.exit(1);
  }
  const database = parseDbArg();
  const log = (msg) => process.stdout.write(`${msg}\n`);
  log(`[db:seed] DB=${database || env.DB_NAME} env=${env.NODE_ENV}`);
  try {
    await withConnection(async (conn) => {
      await seedDatabase(conn, { log });
    }, { database });
    log('[db:seed] OK');
    process.exit(0);
  } catch (err) {
    process.stderr.write(`[db:seed] ERROR: ${err.message}\n`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
