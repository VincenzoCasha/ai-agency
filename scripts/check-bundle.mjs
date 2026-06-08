#!/usr/bin/env node
/**
 * Presupuesto de performance (CRUDO V2, Fase 9).
 *
 * Guardarraíl simple y sin dependencias: tras `npm run build`, comprueba que
 * (1) el chunk principal `dist/assets/index-*.js` no supera el presupuesto de
 * tamaño gzip y (2) el peso total de las imágenes WebP V2 (`public/img/v2/`)
 * se mantiene razonable. Falla con código 1 si se exceden, para usarlo en CI.
 *
 * Los presupuestos llevan holgura sobre el estado actual y son fáciles de
 * ajustar aquí si el proyecto crece de forma justificada.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { gzipSync } from 'node:zlib';
import path from 'node:path';

// --- Presupuestos (ajustar conscientemente) ---------------------------------
const MAIN_CHUNK_GZIP_BUDGET_KB = 160; // actual ≈ 134 KB gzip
const V2_IMAGES_BUDGET_KB = 1536; // 1.5 MB; actual ≈ 1.0 MB

const ROOT = process.cwd();
const DIST_ASSETS = path.join(ROOT, 'dist', 'assets');
const IMG_V2 = path.join(ROOT, 'public', 'img', 'v2');

function fail(msg) {
  console.error(`✗ [check-bundle] ${msg}`);
  process.exitCode = 1;
}

function kb(bytes) {
  return Math.round((bytes / 1024) * 10) / 10;
}

function gzipKbOf(file) {
  return kb(gzipSync(readFileSync(file)).length);
}

function dirWeightKb(dir) {
  if (!existsSync(dir)) return 0;
  let total = 0;
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    const st = statSync(full);
    if (st.isFile()) total += st.size;
  }
  return kb(total);
}

// --- 1. Chunk principal ------------------------------------------------------
if (!existsSync(DIST_ASSETS)) {
  fail('No existe dist/assets. Ejecuta `npm run build` antes de check:bundle.');
  process.exit(process.exitCode || 1);
}

const mainChunks = readdirSync(DIST_ASSETS).filter(
  (f) => /^index-.*\.js$/.test(f),
);

if (mainChunks.length === 0) {
  fail('No se encontró el chunk principal dist/assets/index-*.js.');
} else {
  for (const chunk of mainChunks) {
    const gz = gzipKbOf(path.join(DIST_ASSETS, chunk));
    if (gz > MAIN_CHUNK_GZIP_BUDGET_KB) {
      fail(`${chunk}: ${gz} KB gzip supera el presupuesto de ${MAIN_CHUNK_GZIP_BUDGET_KB} KB.`);
    } else {
      console.log(`✓ [check-bundle] ${chunk}: ${gz} KB gzip (presupuesto ${MAIN_CHUNK_GZIP_BUDGET_KB} KB).`);
    }
  }
}

// --- 2. Imágenes V2 ----------------------------------------------------------
const imgKb = dirWeightKb(IMG_V2);
if (imgKb > V2_IMAGES_BUDGET_KB) {
  fail(`public/img/v2: ${imgKb} KB supera el presupuesto de ${V2_IMAGES_BUDGET_KB} KB.`);
} else {
  console.log(`✓ [check-bundle] public/img/v2: ${imgKb} KB (presupuesto ${V2_IMAGES_BUDGET_KB} KB).`);
}

if (process.exitCode === 1) {
  console.error('\n[check-bundle] Presupuesto excedido. Revisa code splitting / imágenes o ajusta el presupuesto si el crecimiento está justificado.');
} else {
  console.log('\n[check-bundle] OK: dentro de presupuesto.');
}
