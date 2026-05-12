'use strict';

const crypto = require('crypto');
const env = require('../config/env');

/**
 * Hash con SHA-256 + sal opcional. Para fingerprints anonimos (IP/UA en
 * consent_log). Si no hay COOKIE_SECRET (entornos de prueba), usa cadena vacia.
 */
function shortHash(value, { salt } = {}) {
  if (value === undefined || value === null || value === '') return null;
  const usedSalt = salt !== undefined ? salt : env.COOKIE_SECRET || '';
  return crypto
    .createHash('sha256')
    .update(`${usedSalt}::${value}`)
    .digest('hex')
    .slice(0, 64);
}

module.exports = { shortHash };
