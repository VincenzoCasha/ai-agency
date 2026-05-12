#!/usr/bin/env node
'use strict';

/**
 * CLI: aplica migraciones pendientes a la base de datos definida en `.env`
 * (`DB_NAME` por defecto, o el valor pasado en `--database=<name>` / env
 * `DB_OVERRIDE`).
 *
 * Uso:
 *   node db/migrate.js
 *   node db/migrate.js --database=crudo_test
 *   DB_OVERRIDE=crudo_test node db/migrate.js
 */

const { runMigrations } = require('./migration-runner');

function parseDbArg() {
  const arg = process.argv.find((a) => a.startsWith('--database='));
  if (arg) return arg.split('=')[1];
  return process.env.DB_OVERRIDE || undefined;
}

async function main() {
  const database = parseDbArg();
  const log = (msg) => process.stdout.write(`${msg}\n`);
  log(`[db:migrate] DB=${database || process.env.DB_NAME || 'crudo'}`);
  try {
    const { applied, skipped } = await runMigrations({ database, log });
    log(`[db:migrate] aplicadas=${applied.length} omitidas=${skipped.length}`);
    process.exit(0);
  } catch (err) {
    process.stderr.write(`[db:migrate] ERROR: ${err.message}\n`);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
