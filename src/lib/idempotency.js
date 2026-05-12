/**
 * Genera una clave de idempotencia por submission. La clave es estable durante
 * reintentos de la misma submission (sin cambio de payload por parte del
 * usuario) y se renueva cuando el usuario modifica datos y reenvia.
 *
 * Formato: ULID-like — `<timestamp36>-<random36>`. Suficientemente unico para
 * V1; el backend (Fase 4) la persiste con SHA-256 y TTL 24h.
 */

export function generateIdempotencyKey() {
  if (typeof globalThis !== 'undefined' && globalThis.crypto && typeof globalThis.crypto.randomUUID === 'function') {
    return globalThis.crypto.randomUUID();
  }
  const ts = Date.now().toString(36);
  const rand = Math.random().toString(36).slice(2, 12).padEnd(10, '0');
  return `${ts}-${rand}`;
}

export const IDEMPOTENCY_HEADER = 'Idempotency-Key';
