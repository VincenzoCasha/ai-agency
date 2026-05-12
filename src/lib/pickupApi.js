import { api, ApiError } from './api';
import { IDEMPOTENCY_HEADER } from './idempotency';

/**
 * Envia una solicitud de pickup al backend (Fase 4). Reintentos automaticos:
 *  - solo 1 retry para errores de red (status 0). El idempotency key garantiza
 *    que el backend no creara duplicados si el primer intento llego pero la
 *    respuesta no.
 *  - no retry para 4xx (incluyendo 422 alcohol y 409 conflict).
 *  - no retry para 5xx (no sabemos si el servidor procesó la mitad).
 */
export async function submitPickupOrder(payload, { idempotencyKey, retried = false } = {}) {
  if (!idempotencyKey) throw new Error('submitPickupOrder requires idempotencyKey');
  try {
    const res = await api.post('/pickup-orders', payload, {
      headers: { [IDEMPOTENCY_HEADER]: idempotencyKey },
    });
    return { ok: true, status: res.status, data: res.data };
  } catch (err) {
    if (err instanceof ApiError) {
      // Network error: reintentar una vez.
      if (err.status === 0 && !retried) {
        return submitPickupOrder(payload, { idempotencyKey, retried: true });
      }
      return { ok: false, status: err.status, error: err };
    }
    return { ok: false, status: 0, error: err };
  }
}
