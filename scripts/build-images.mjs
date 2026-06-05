#!/usr/bin/env node
/**
 * CRUDO V2 — Pipeline de imágenes (Fase 4)
 *
 * Genera variantes WebP responsive a partir de las fotos curadas, recortadas
 * al ratio correcto por rol (hero 16:10/16:9, card 1:1, poster 3:4). Las
 * salidas van a `public/img/v2/` y se consumen vía `src/lib/v2Assets.js`.
 *
 * Uso: `npm run build:images`  (o `node scripts/build-images.mjs`)
 *
 * No borra assets V1. Es idempotente: re-ejecutar regenera las mismas salidas.
 * sharp es devDependency: este script corre en build/local, nunca en el cliente.
 */
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { mkdir, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'public', 'img', 'v2');
const PUBLIC_PREFIX = '/img/v2';

// WebP quality por rol: fotos grandes algo más comprimidas, cards más nítidas.
const Q_HERO = 72;
const Q_CARD = 78;
const Q_POSTER = 80;

/**
 * Curación: cada rol apunta a una foto fuente (alta resolución ya en el repo),
 * con su ratio, anchos a generar, alt y gravedad de recorte.
 * gravity 'attention' = sharp detecta la zona de mayor interés (sujeto).
 */
const ASSETS = [
  // ── HOME ────────────────────────────────────────────────────────────────
  {
    id: 'home-hero',
    src: 'public/img/hero/hero-home-cheeseboard-pro.jpg',
    ratio: [16, 10],
    widths: [768, 1200, 1800],
    quality: Q_HERO,
    gravity: 'attention',
    alt: 'Tabla de quesos artesanos sobre madera en CRUDO',
  },
  {
    id: 'home-hero-mobile',
    src: 'public/img/hero/hero-home-cheeseboard-pro.jpg',
    ratio: [4, 5],
    widths: [480, 768],
    quality: Q_HERO,
    gravity: 'attention',
    alt: 'Tabla de quesos artesanos sobre madera en CRUDO',
  },
  // ── SELECCIÓN DEL MES ────────────────────────────────────────────────────
  {
    id: 'seleccion-hero',
    src: 'public/img/lifestyle/tabla-quesos-vino-pro.jpg',
    ratio: [16, 9],
    widths: [768, 1200, 1800],
    quality: Q_HERO,
    gravity: 'attention',
    alt: 'Selección de quesos de temporada en CRUDO',
  },
  // ── TABLAS / CAJAS / FROMELIER ───────────────────────────────────────────
  {
    id: 'tablas-hero',
    src: 'public/img/lifestyle/tabla-quesos-vino-pro.jpg',
    ratio: [16, 10],
    widths: [768, 1200, 1800],
    quality: Q_HERO,
    gravity: 'attention',
    alt: 'Tabla de quesos con copas de vino para llevar',
  },
  // ── EVENTOS ──────────────────────────────────────────────────────────────
  {
    id: 'eventos-hero',
    src: 'public/img/lifestyle/cata-vinos-naturales-pro.jpg',
    ratio: [16, 9],
    widths: [768, 1200, 1800],
    quality: Q_HERO,
    gravity: 'attention',
    alt: 'Cata de vinos naturales en la barra de CRUDO',
  },
  {
    id: 'evento-poster-telperion',
    src: 'public/img/events/wine-tasting-telperion.jpg',
    ratio: [3, 4],
    widths: [480, 768, 1000],
    quality: Q_POSTER,
    gravity: 'centre',
    alt: 'Cartel del evento Wine Tasting con Bodegas Telperion',
  },
  // ── CONTACTO / LOCAL ─────────────────────────────────────────────────────
  {
    id: 'contacto-local',
    src: 'public/img/about/mostrador-quesera.jpg',
    ratio: [16, 9],
    widths: [768, 1200],
    quality: Q_HERO,
    gravity: 'attention',
    alt: 'Mostrador de la tienda CRUDO en Madrid',
  },
  // ── FALLBACKS DE CARD (1:1) ──────────────────────────────────────────────
  {
    id: 'fallback-queso',
    src: 'public/img/hero/hero-home-cheeseboard-pro.jpg',
    ratio: [1, 1],
    widths: [400, 800],
    quality: Q_CARD,
    gravity: 'attention',
    alt: 'Queso artesano de CRUDO',
  },
  {
    id: 'fallback-maridaje',
    src: 'public/img/lifestyle/vino-natural-mano-pro.jpg',
    ratio: [1, 1],
    widths: [400, 800],
    quality: Q_CARD,
    gravity: 'attention',
    alt: 'Maridaje de vino natural en CRUDO',
  },
  {
    id: 'fallback-tabla',
    src: 'public/img/lifestyle/tabla-quesos-vino-pro.jpg',
    ratio: [1, 1],
    widths: [400, 800],
    quality: Q_CARD,
    gravity: 'attention',
    alt: 'Tabla de quesos de CRUDO',
  },
  // ── LIFESTYLE HORIZONTAL (uso editorial general) ─────────────────────────
  {
    id: 'lifestyle-bodegon',
    src: 'public/img/lifestyle/bodegon-cartel-crudo-pro.jpg',
    ratio: [16, 9],
    widths: [768, 1200],
    quality: Q_HERO,
    gravity: 'attention',
    alt: 'Bodegón con el cartel de CRUDO',
  },
];

function heightFor(width, [rw, rh]) {
  return Math.round((width * rh) / rw);
}

async function processAsset(asset) {
  const absSrc = path.join(ROOT, asset.src);
  if (!existsSync(absSrc)) {
    throw new Error(`Fuente no encontrada: ${asset.src}`);
  }
  const outputs = [];
  const maxWidth = Math.max(...asset.widths);
  for (const width of asset.widths) {
    const height = heightFor(width, asset.ratio);
    const fileName = `${asset.id}-${width}.webp`;
    const absOut = path.join(OUT_DIR, fileName);
    await sharp(absSrc)
      .resize(width, height, {
        fit: 'cover',
        position: asset.gravity === 'attention' ? sharp.strategy.attention : asset.gravity,
        withoutEnlargement: false,
      })
      .webp({ quality: asset.quality })
      .toFile(absOut);
    outputs.push({ width, height, url: `${PUBLIC_PREFIX}/${fileName}` });
  }
  const largest = outputs.find((o) => o.width === maxWidth);
  return {
    id: asset.id,
    alt: asset.alt,
    ratio: asset.ratio.join('/'),
    width: largest.width,
    height: largest.height,
    src: largest.url,
    srcSet: outputs.map((o) => `${o.url} ${o.width}w`).join(', '),
    sources: outputs,
  };
}

function renderManifest(entries) {
  const obj = {};
  for (const e of entries) {
    obj[e.id] = {
      alt: e.alt,
      ratio: e.ratio,
      width: e.width,
      height: e.height,
      src: e.src,
      srcSet: e.srcSet,
    };
  }
  const json = JSON.stringify(obj, null, 2);
  return `// AUTOGENERADO por scripts/build-images.mjs — NO editar a mano.
// Pipeline de imágenes V2 (Fase 4). Regenerar con: npm run build:images
//
// Cada entrada: { alt, ratio, width, height, src (mayor), srcSet (responsive) }.
// Uso en JSX:
//   import { V2_ASSETS } from '../lib/v2Assets';
//   const a = V2_ASSETS['home-hero'];
//   <img src={a.src} srcSet={a.srcSet} sizes="100vw" width={a.width}
//        height={a.height} alt={a.alt} loading="lazy" decoding="async" />

export const V2_ASSETS = ${json};

export function getAsset(id) {
  return V2_ASSETS[id] || null;
}
`;
}

async function main() {
  console.log('[build-images] limpiando', path.relative(ROOT, OUT_DIR));
  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });

  const entries = [];
  for (const asset of ASSETS) {
    process.stdout.write(`[build-images] ${asset.id} … `);
    const entry = await processAsset(asset);
    console.log(`${entry.sources.length} variantes`);
    entries.push(entry);
  }

  const manifestPath = path.join(ROOT, 'src', 'lib', 'v2Assets.js');
  await writeFile(manifestPath, renderManifest(entries), 'utf8');
  console.log('[build-images] manifest →', path.relative(ROOT, manifestPath));
  console.log(`[build-images] OK · ${entries.length} roles, ${entries.reduce((n, e) => n + e.sources.length, 0)} archivos WebP`);
}

main().catch((err) => {
  console.error('[build-images] ERROR:', err.message);
  process.exit(1);
});
