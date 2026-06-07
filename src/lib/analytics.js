/**
 * Analytics consent-aware (CRUDO V2 — Fase 8).
 * Todos los `track*` son no-op si el usuario no ha aceptado la categoria
 * correspondiente. GA4 real se carga SOLO si existe `VITE_GA_ID` y el usuario
 * ha consentido (carga perezosa, nunca antes del consentimiento). Sin PII.
 */

import { isCategoryAllowed } from './consent';

const ANALYTICS_CATEGORY = 'analytics';
const MARKETING_CATEGORY = 'marketing';

const GA_ID = (import.meta?.env?.VITE_GA_ID || '').trim();
let gaLoaded = false;

/** Carga gtag.js una sola vez, bajo demanda, tras consentimiento de analytics. */
function ensureGaLoaded() {
  if (!GA_ID || gaLoaded || typeof window === 'undefined') return;
  if (!isCategoryAllowed(ANALYTICS_CATEGORY)) return;
  gaLoaded = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  window.gtag('config', GA_ID, { anonymize_ip: true, allow_google_signals: false });
  const s = document.createElement('script');
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
}

function emit(event, payload, category) {
  if (!isCategoryAllowed(category)) return false;
  // Espejo en window para inspeccion en dev y para tests.
  if (typeof window !== 'undefined') {
    window.__crudoAnalytics = window.__crudoAnalytics || [];
    window.__crudoAnalytics.push({ event, payload, ts: Date.now() });
    // GA4 real solo si esta configurado y consentido. No se envia PII.
    if (GA_ID) {
      ensureGaLoaded();
      if (typeof window.gtag === 'function') {
        window.gtag('event', event, payload || {});
      }
    }
  }
  return true;
}

export function trackSelectItem(payload = {}) {
  return emit('select_item', payload, ANALYTICS_CATEGORY);
}

export function trackPickupRequest(payload = {}) {
  return emit('pickup_request', payload, ANALYTICS_CATEGORY);
}

export function trackWineWhatsAppClick(payload = {}) {
  // Acto comercial clave: el lead a WhatsApp por maridaje.
  return emit('wine_pairing_whatsapp_click', payload, MARKETING_CATEGORY);
}

export function trackGenerateLead(payload = {}) {
  return emit('generate_lead', payload, MARKETING_CATEGORY);
}

export function trackWhatsAppClick(payload = {}) {
  return emit('whatsapp_click', payload, MARKETING_CATEGORY);
}

export function trackMapsClick(payload = {}) {
  return emit('maps_click', payload, ANALYTICS_CATEGORY);
}

export function trackEventInquiry(payload = {}) {
  return emit('event_inquiry', payload, MARKETING_CATEGORY);
}

export function _drainAnalyticsForTest() {
  if (typeof window === 'undefined') return [];
  const list = window.__crudoAnalytics || [];
  window.__crudoAnalytics = [];
  return list;
}
