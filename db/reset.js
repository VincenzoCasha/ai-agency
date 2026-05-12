#!/usr/bin/env node
'use strict';

/**
 * CLI: borra TODAS las tablas de la base de datos objetivo y vuelve a aplicar
 * migraciones desde cero. Solo se permite en `NODE_ENV=development` o `test`.
 *
 * Uso:
 *   NODE_ENV=development node db/reset.js
 *   NODE_ENV=test        node db/reset.js --database=crudo_test
 */

const env = require('../server/config/env');
const { dropAllTables, runMigrations } = require('./migration-runner');

function parseDbArg() {
  const arg = process.argv.find((a) => a.startsWith('--database='));
  if (arg) return arg.split('=')[1];
  return process.env.DB_OVERRIDE || undefined;
}

async function main() {
  if (env.NODE_ENV === 'production') {
    process.stderr.write('[db:reset] ABORT: prohibido en NODE_ENV=production\n');
    process.exit(1);
  }
  if (env.NODE_ENV !== 'development' && env.NODE_ENV !== 'test') {
    process.stderr.write(`[db:reset] ABORT: NODE_ENV=${env.NODE_ENV} no permitido (solo development/test)\n`);
    process.exit(1);
  }
  const database = parseDbArg();
  const log = (msg) => process.stdout.write(`${msg}\n`);
  log(`[db:reset] DB=${database || env.DB_NAME} env=${env.NODE_ENV}`);
  try {
    const dropped = await dropAllTables({ database, log });
    log(`[db:reset] tablas borradas: ${dropped.dropped.length}`);
    const { applied } = await runMigrations({ database, log });
    log(`[db:reset] migraciones aplicadas: ${applied.length}`);
    process.exit(0);
  } catch (err) {
    process.stderr.write(`[db:reset] ERROR: ${err.message}\n`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
