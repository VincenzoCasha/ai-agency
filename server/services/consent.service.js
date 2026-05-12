'use strict';

/**
 * Consent service.
 * Registra la decision de cookies del usuario sin cargar trackers.
 * `expires_at` por defecto a 24 meses (recomendacion AEPD).
 */

const consentRepo = require('../repositories/consent.repository');
const { shortHash } = require('../utils/hash');

const TWENTY_FOUR_MONTHS_MS = 24 * 30 * 24 * 60 * 60 * 1000;

function expiresInMonths(months = 24) {
  const now = new Date();
  const out = new Date(now.getTime());
  out.setUTCMonth(out.getUTCMonth() + months);
  return out;
}

async function record({ consentId, analytics, marketing, preferences, ip, userAgent }) {
  const expiresAt = expiresInMonths(24);
  const id = await consentRepo.create({
    consentId,
    analytics: !!analytics,
    marketing: !!marketing,
    preferences: !!preferences,
    ipHash: ip ? shortHash(ip) : null,
    userAgentHash: userAgent ? shortHash(userAgent) : null,
    expiresAt,
  });
  return { id, expires_at: expiresAt.toISOString() };
}

module.exports = { record, expiresInMonths, TWENTY_FOUR_MONTHS_MS };
