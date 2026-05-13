import { api, ApiError } from './api';
import { IDEMPOTENCY_HEADER } from './idempotency';

/**
 * `POST /events/:slug/reservations` con `Idempotency-Key`. Retry 1× solo para
 * errores de red (status 0). El backend (Fase 3) ya rechaza eventos pasados,
 * llenos o inactivos con 4xx.
 */
export async function submitEventReservation(slug, payload, { idempotencyKey, retried = false } = {}) {
  if (!slug) throw new Error('submitEventReservation requires event slug');
  if (!idempotencyKey) throw new Error('submitEventReservation requires idempotencyKey');
  try {
    const res = await api.post(`/events/${encodeURIComponent(slug)}/reservations`, payload, {
      headers: { [IDEMPOTENCY_HEADER]: idempotencyKey },
    });
    return { ok: true, status: res.status, data: res.data };
  } catch (err) {
    if (err instanceof ApiError) {
      if (err.status === 0 && !retried) {
        return submitEventReservation(slug, payload, { idempotencyKey, retried: true });
      }
      return { ok: false, status: err.status, error: err };
    }
    return { ok: false, status: 0, error: err };
  }
}
