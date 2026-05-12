'use strict';

/**
 * JWT service.
 * Firma y verifica access tokens con `JWT_SECRET`. Refresh tokens se firman
 * con un secreto derivado para forzar separacion (mismo `JWT_SECRET` con
 * sufijo) y se persisten hasheados en `admin_refresh_token`.
 */

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const env = require('../config/env');

const ACCESS_AUDIENCE = 'crudo-admin';
const ACCESS_ISSUER = 'crudo-api';

function getAccessSecret() {
  if (!env.JWT_SECRET) {
    throw new Error('JWT_SECRET vacio: el admin requiere un secreto firmado.');
  }
  return env.JWT_SECRET;
}

function getRefreshSecret() {
  return `${getAccessSecret()}::refresh`;
}

function signAccessToken({ adminId, email, role }) {
  return jwt.sign(
    { sub: String(adminId), email, role },
    getAccessSecret(),
    {
      expiresIn: env.JWT_EXPIRES_IN || '15m',
      audience: ACCESS_AUDIENCE,
      issuer: ACCESS_ISSUER,
    },
  );
}

function verifyAccessToken(token) {
  return jwt.verify(token, getAccessSecret(), {
    audience: ACCESS_AUDIENCE,
    issuer: ACCESS_ISSUER,
  });
}

function signRefreshToken({ adminId }) {
  // Anadimos un nonce aleatorio para que dos refresh tokens emitidos en el
  // mismo segundo difieran y se hashen distinto en DB.
  const nonce = crypto.randomBytes(16).toString('hex');
  return jwt.sign(
    { sub: String(adminId), nonce, kind: 'refresh' },
    getRefreshSecret(),
    { expiresIn: env.JWT_REFRESH_EXPIRES_IN || '7d', issuer: ACCESS_ISSUER },
  );
}

function verifyRefreshToken(token) {
  return jwt.verify(token, getRefreshSecret(), { issuer: ACCESS_ISSUER });
}

function hashRefreshToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

module.exports = {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashRefreshToken,
};
