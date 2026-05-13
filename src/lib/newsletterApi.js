import { api, ApiError } from './api';

/**
 * `POST /newsletter/subscribe`. Backend (Fase 3) usa Brevo si está configurado,
 * sino se comporta como noop documentado y devuelve 202. La UI muestra
 * "revisa tu correo" en ambos casos para no exponer estado interno.
 */
export async function subscribeNewsletter({ email, source }) {
  try {
    const res = await api.post('/newsletter/subscribe', { email, source });
    return { ok: true, status: res.status, data: res.data };
  } catch (err) {
    if (err instanceof ApiError) {
      return { ok: false, status: err.status, error: err };
    }
    return { ok: false, status: 0, error: err };
  }
}
