/**
 * Analytics consent-aware.
 * Todos los `track*` son no-op si el usuario no ha aceptado la categoria
 * correspondiente. No inyectamos GA4/Pixel reales todavia (Fase 12).
 */

import { isCategoryAllowed } from './consent';

const ANALYTICS_CATEGORY = 'analytics';
const MARKETING_CATEGORY = 'marketing';

function emit(event, payload, category) {
  if (!isCategoryAllowed(category)) return false;
  // En Fase 12 esto se conectara a GA4/Pixel reales.
  // Por ahora exponemos en window para inspeccion en dev y para tests.
  if (typeof window !== 'undefined') {
    window.__crudoAnalytics = window.__crudoAnalytics || [];
    window.__crudoAnalytics.push({ event, payload, ts: Date.now() });
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
