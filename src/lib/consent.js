/**
 * Modelo de consentimiento de cookies (AEPD).
 * Se persiste en localStorage con version y fecha. Sin proveedor externo.
 *
 * Forma:
 *   {
 *     version: '1',
 *     consent_id: '<uuid>',
 *     timestamp: <ISO>,
 *     analytics: boolean,
 *     marketing: boolean,
 *     preferences: boolean,
 *   }
 *
 * Si la version cambia en el futuro, el banner debe re-pedir consentimiento.
 */

const STORAGE_KEY = 'crudo:consent:v1';
const CURRENT_VERSION = '1';

export const CATEGORY_KEYS = ['analytics', 'marketing', 'preferences'];

export const DEFAULT_CONSENT = {
  version: CURRENT_VERSION,
  consent_id: null,
  timestamp: null,
  analytics: false,
  marketing: false,
  preferences: false,
};

function uuid() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  // Fallback determinista suficiente para entornos sin crypto.
  return `consent-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}

function safeStorage() {
  try {
    if (typeof window === 'undefined') return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

export function loadConsent() {
  const ls = safeStorage();
  if (!ls) return null;
  try {
    const raw = ls.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || parsed.version !== CURRENT_VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveConsent(partial) {
  const ls = safeStorage();
  const previous = loadConsent() || DEFAULT_CONSENT;
  const next = {
    ...previous,
    ...partial,
    version: CURRENT_VERSION,
    consent_id: previous.consent_id || partial.consent_id || uuid(),
    timestamp: new Date().toISOString(),
  };
  if (ls) {
    try { ls.setItem(STORAGE_KEY, JSON.stringify(next)); } catch { /* ignore */ }
  }
  return next;
}

export function clearConsent() {
  const ls = safeStorage();
  if (ls) {
    try { ls.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  }
}

export function acceptAll() {
  return saveConsent({ analytics: true, marketing: true, preferences: true });
}

export function rejectAll() {
  return saveConsent({ analytics: false, marketing: false, preferences: false });
}

export function setCategories({ analytics = false, marketing = false, preferences = false }) {
  return saveConsent({ analytics, marketing, preferences });
}

export function isCategoryAllowed(category) {
  if (!CATEGORY_KEYS.includes(category)) return false;
  const c = loadConsent();
  return !!(c && c[category]);
}

export const CONSENT_STORAGE_KEY = STORAGE_KEY;
export const CONSENT_VERSION = CURRENT_VERSION;
