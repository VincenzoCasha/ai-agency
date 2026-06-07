import axios from 'axios';
import { toApiError } from './api';

/**
 * Cliente HTTP para el panel admin (CRUDO V2 — Fase 7).
 * Base `/api/v1/admin`. Inyecta `Authorization: Bearer <access_token>` y, ante
 * un 401, intenta refrescar el token una vez con el refresh_token.
 *
 * RIESGO DOCUMENTADO: los tokens se guardan en localStorage por simplicidad de
 * un panel single-operator. Esto es vulnerable a XSS; el frontend no carga
 * scripts de terceros en /admin para mitigarlo. Una alternativa más segura
 * (cookies httpOnly) queda anotada como mejora futura.
 */

const ADMIN_BASE = (import.meta?.env?.VITE_API_BASE || '/api/v1') + '/admin';

const ACCESS_KEY = 'crudo_admin_access';
const REFRESH_KEY = 'crudo_admin_refresh';
const USER_KEY = 'crudo_admin_user';

export const adminTokens = {
  get access() {
    return localStorage.getItem(ACCESS_KEY);
  },
  get refresh() {
    return localStorage.getItem(REFRESH_KEY);
  },
  get user() {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
    } catch {
      return null;
    }
  },
  save({ access_token, refresh_token, admin }) {
    if (access_token) localStorage.setItem(ACCESS_KEY, access_token);
    if (refresh_token) localStorage.setItem(REFRESH_KEY, refresh_token);
    if (admin) localStorage.setItem(USER_KEY, JSON.stringify(admin));
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
  },
};

export const adminApi = axios.create({
  baseURL: ADMIN_BASE,
  timeout: 15000,
  headers: { Accept: 'application/json' },
});

adminApi.interceptors.request.use((config) => {
  const token = adminTokens.access;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

let refreshing = null;

adminApi.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config || {};
    const status = error.response?.status;
    const refreshToken = adminTokens.refresh;

    // 401 una sola vez → intenta refrescar y reintentar la petición original.
    if (status === 401 && refreshToken && !original.__retried) {
      original.__retried = true;
      try {
        refreshing =
          refreshing ||
          axios.post(`${ADMIN_BASE}/auth/refresh`, { refresh_token: refreshToken });
        const { data } = await refreshing;
        refreshing = null;
        adminTokens.save(data);
        original.headers = original.headers || {};
        original.headers.Authorization = `Bearer ${data.access_token}`;
        return adminApi(original);
      } catch (e) {
        refreshing = null;
        adminTokens.clear();
        if (typeof window !== 'undefined') window.location.assign('/admin');
        return Promise.reject(toApiError(e));
      }
    }
    return Promise.reject(toApiError(error));
  },
);

// ── Llamadas tipadas ──────────────────────────────────────────────────────
export const adminAuth = {
  login: (email, password) =>
    axios
      .post(`${ADMIN_BASE}/auth/login`, { email, password })
      .then((r) => r.data)
      .catch((e) => Promise.reject(toApiError(e))),
  logout: (refresh_token) =>
    axios.post(`${ADMIN_BASE}/auth/logout`, { refresh_token }).catch(() => null),
};

export const adminResources = {
  dashboard: () => adminApi.get('/dashboard').then((r) => r.data),
  products: (params) => adminApi.get('/products', { params }).then((r) => r.data),
  setProductStock: (id, stock_status) =>
    adminApi.patch(`/products/${id}/stock`, { stock_status }).then((r) => r.data),
  events: (params) => adminApi.get('/events', { params }).then((r) => r.data),
  pickupOrders: (params) =>
    adminApi.get('/pickup-orders', { params }).then((r) => r.data),
  setPickupStatus: (id, status) =>
    adminApi.patch(`/pickup-orders/${id}`, { status }).then((r) => r.data),
  inquiries: (params) => adminApi.get('/inquiries', { params }).then((r) => r.data),
};
