import axios from 'axios';

/**
 * Cliente HTTP unico para hablar con la API publica de CRUDO.
 *
 * - `VITE_API_BASE` permite cambiar el prefijo (default `/api/v1`).
 * - Normaliza errores RFC 7807 a un objeto manejable por la UI.
 * - No hardcodea dominios: la baseURL relativa funciona detras del mismo
 *   `server.js` que sirve la SPA en produccion.
 */

const API_BASE = (import.meta?.env?.VITE_API_BASE) || '/api/v1';

export const api = axios.create({
  baseURL: API_BASE,
  timeout: 12000,
  headers: { Accept: 'application/json' },
});

export class ApiError extends Error {
  constructor({ status, code, title, detail, errors, type, instance, raw }) {
    super(detail || title || 'Error de red');
    this.name = 'ApiError';
    this.status = status;
    this.code = code || null;
    this.title = title || null;
    this.detail = detail || null;
    this.errors = Array.isArray(errors) ? errors : [];
    this.type = type || null;
    this.instance = instance || null;
    this.raw = raw || null;
  }
}

/**
 * Convierte un error de axios a `ApiError` legible. Si la respuesta es
 * problem+json (RFC 7807), aprovecha sus campos.
 */
export function toApiError(err) {
  if (err && err.isAxiosError && err.response) {
    const data = err.response.data || {};
    return new ApiError({
      status: err.response.status,
      code: data.code,
      title: data.title,
      detail: data.detail,
      errors: data.errors,
      type: data.type,
      instance: data.instance,
      raw: data,
    });
  }
  return new ApiError({
    status: 0,
    title: 'Network',
    detail: err?.message || 'Error desconocido',
    raw: err,
  });
}

api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(toApiError(err)),
);

export const API_BASE_URL = API_BASE;
