'use strict';

/**
 * Storage service local-friendly y compatible con Plesk/Contabo.
 *  - Usa el filesystem bajo `UPLOADS_DIR`.
 *  - Genera nombres unicos saneados (slug + timestamp + nonce).
 *  - Devuelve la URL publica que servira `/uploads/...` desde Express estatico.
 *
 * `sharp` queda como TODO opcional para fases posteriores (resize/WebP).
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const multer = require('multer');
const env = require('../config/env');

const ALLOWED_MIME = new Set(['image/jpeg', 'image/png', 'image/webp']);
const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp']);

function uploadsRoot() {
  // En tests usamos un subdir aislado para no contaminar `uploads/` de dev.
  const baseDir = env.NODE_ENV === 'test' ? path.join(env.UPLOADS_DIR, 'test') : env.UPLOADS_DIR;
  return path.resolve(process.cwd(), baseDir);
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function sanitizeBaseName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60) || 'image';
}

function buildUniqueFilename(originalName) {
  const ext = path.extname(originalName).toLowerCase();
  const base = sanitizeBaseName(path.basename(originalName, ext));
  const nonce = crypto.randomBytes(6).toString('hex');
  const ts = Date.now();
  return `${base}-${ts}-${nonce}${ext}`;
}

function fileFilter(_req, file, cb) {
  if (!ALLOWED_MIME.has(file.mimetype)) {
    const err = new Error(`Tipo no permitido: ${file.mimetype}`);
    err.code = 'INVALID_MIME';
    return cb(err);
  }
  const ext = path.extname(file.originalname).toLowerCase();
  if (!ALLOWED_EXT.has(ext)) {
    const err = new Error(`Extension no permitida: ${ext}`);
    err.code = 'INVALID_EXT';
    return cb(err);
  }
  cb(null, true);
}

function buildProductImageUploader() {
  const dest = path.join(uploadsRoot(), 'products');
  ensureDir(dest);

  const storage = multer.diskStorage({
    destination(_req, _file, cb) {
      ensureDir(dest);
      cb(null, dest);
    },
    filename(_req, file, cb) {
      cb(null, buildUniqueFilename(file.originalname));
    },
  });

  return multer({
    storage,
    limits: {
      fileSize: env.MAX_UPLOAD_MB * 1024 * 1024,
      files: 1,
    },
    fileFilter,
  }).single('image');
}

function publicUrlFor(filename, kind = 'products') {
  const baseDir = env.NODE_ENV === 'test' ? path.join(env.UPLOADS_DIR, 'test') : env.UPLOADS_DIR;
  // Normalizamos a `/uploads/...` para el front.
  const root = baseDir.replace(/^\/+/, '').replace(/^uploads\/?/, '');
  const prefix = root ? `/uploads/${root}/${kind}` : `/uploads/${kind}`;
  return `${prefix}/${filename}`.replace(/\/+/g, '/');
}

async function deleteByPublicUrl(url) {
  if (!url) return;
  // El URL publico empieza por `/uploads/...`; mapea a un path bajo cwd.
  const rel = url.replace(/^\/+/, '');
  const abs = path.resolve(process.cwd(), rel);
  if (!abs.startsWith(path.resolve(process.cwd(), 'uploads'))) return;
  try {
    await fs.promises.unlink(abs);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
}

module.exports = {
  buildProductImageUploader,
  publicUrlFor,
  uploadsRoot,
  deleteByPublicUrl,
  ALLOWED_MIME,
  ALLOWED_EXT,
};
