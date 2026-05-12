'use strict';

/**
 * Admin auth service.
 *
 * Reglas:
 *  - Login valida bcrypt y emite access (corto) + refresh (largo, persistido).
 *  - Refresh rota: revoca el viejo y emite uno nuevo.
 *  - Logout revoca el refresh recibido. El access JWT seguira siendo valido
 *    hasta su expiracion natural (riesgo aceptado por simplicidad V1; mitigado
 *    por TTL corto del access token).
 */

const bcrypt = require('bcryptjs');
const adminUserRepo = require('../repositories/admin-user.repository');
const refreshRepo = require('../repositories/admin-refresh-token.repository');
const jwtService = require('./jwt.service');
const { shortHash } = require('../utils/hash');
const env = require('../config/env');

const REFRESH_TTL_MS = parseRefreshMs(env.JWT_REFRESH_EXPIRES_IN || '7d');

function parseRefreshMs(value) {
  if (typeof value === 'number') return value;
  const m = /^(\d+)([smhd])$/.exec(String(value).trim());
  if (!m) return 7 * 24 * 60 * 60 * 1000;
  const n = Number(m[1]);
  const mult = { s: 1000, m: 60 * 1000, h: 60 * 60 * 1000, d: 24 * 60 * 60 * 1000 }[m[2]];
  return n * mult;
}

function publicAdmin(admin) {
  return { id: admin.id, email: admin.email, role: admin.role };
}

class AuthError extends Error {
  constructor(status, code, detail) {
    super(detail);
    this.status = status;
    this.detail = detail;
    this.title = status === 401 ? 'Unauthorized' : status === 403 ? 'Forbidden' : 'Error';
    this.extra = { code };
  }
}

async function login({ email, password, ip, userAgent }) {
  const admin = await adminUserRepo.findActiveByEmail(email);
  // Falla de forma constante para no filtrar existencia de usuarios.
  const dummyHash = '$2a$10$abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUV';
  const hash = admin ? admin.password_hash : dummyHash;
  const ok = await bcrypt.compare(password || '', hash);
  if (!admin || !ok) {
    throw new AuthError(401, 'INVALID_CREDENTIALS', 'Email o password invalidos.');
  }
  return issueTokensFor(admin, { ip, userAgent });
}

async function issueTokensFor(admin, { ip, userAgent } = {}) {
  const accessToken = jwtService.signAccessToken({
    adminId: admin.id, email: admin.email, role: admin.role,
  });
  const refreshToken = jwtService.signRefreshToken({ adminId: admin.id });
  await refreshRepo.create({
    adminUserId: admin.id,
    tokenHash: jwtService.hashRefreshToken(refreshToken),
    ipHash: ip ? shortHash(ip) : null,
    userAgentHash: userAgent ? shortHash(userAgent) : null,
    expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
  });
  return {
    access_token: accessToken,
    refresh_token: refreshToken,
    token_type: 'Bearer',
    expires_in_seconds: parseRefreshMs(env.JWT_EXPIRES_IN || '15m') / 1000,
    admin: publicAdmin(admin),
  };
}

async function refresh({ refreshToken, ip, userAgent }) {
  if (!refreshToken) {
    throw new AuthError(401, 'REFRESH_TOKEN_REQUIRED', 'refresh_token requerido.');
  }
  let payload;
  try {
    payload = jwtService.verifyRefreshToken(refreshToken);
  } catch {
    throw new AuthError(401, 'REFRESH_TOKEN_INVALID', 'refresh_token invalido o expirado.');
  }
  const stored = await refreshRepo.findActiveByHash(jwtService.hashRefreshToken(refreshToken));
  if (!stored) {
    throw new AuthError(401, 'REFRESH_TOKEN_REVOKED', 'refresh_token revocado o desconocido.');
  }
  const admin = await adminUserRepo.findById(Number(payload.sub));
  if (!admin || !admin.is_active) {
    throw new AuthError(401, 'ADMIN_INACTIVE', 'El usuario admin esta inactivo.');
  }

  // Rotacion: revocamos el actual y emitimos uno nuevo.
  await refreshRepo.revokeByHash(stored.token_hash);
  return issueTokensFor(admin, { ip, userAgent });
}

async function logout({ refreshToken }) {
  if (!refreshToken) return { ok: true };
  await refreshRepo.revokeByHash(jwtService.hashRefreshToken(refreshToken));
  return { ok: true };
}

async function loadAdminFromAccessToken(accessToken) {
  let payload;
  try {
    payload = jwtService.verifyAccessToken(accessToken);
  } catch (err) {
    throw new AuthError(401, err.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'TOKEN_INVALID', 'Token invalido o expirado.');
  }
  const admin = await adminUserRepo.findById(Number(payload.sub));
  if (!admin || !admin.is_active) {
    throw new AuthError(401, 'ADMIN_INACTIVE', 'Usuario admin no disponible.');
  }
  return admin;
}

module.exports = {
  login,
  refresh,
  logout,
  loadAdminFromAccessToken,
  publicAdmin,
  AuthError,
  REFRESH_TTL_MS,
};
