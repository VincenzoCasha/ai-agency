import { api, ApiError } from './api';

/**
 * `POST /inquiries`. Tipos validos en backend (Fase 3): CONTACT, WHOLESALE,
 * EVENT_PRIVATE. La UI nunca envía PII al frontend analytics; solo el
 * backend recibe email/phone para responder.
 */
export async function submitInquiry(payload) {
  try {
    const res = await api.post('/inquiries', payload);
    return { ok: true, status: res.status, data: res.data };
  } catch (err) {
    if (err instanceof ApiError) {
      return { ok: false, status: err.status, error: err };
    }
    return { ok: false, status: 0, error: err };
  }
}
