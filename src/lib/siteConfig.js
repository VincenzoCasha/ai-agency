import { api } from './api';

/**
 * Datos publicos del sitio. El fallback aqui se mantiene en sincronia con
 * `server/services/site-config.service.js` para que la UI no se rompa si la
 * API falla o el cliente esta offline.
 */
export const FALLBACK_SITE_CONFIG = {
  brand: 'CRUDO',
  legal_name: 'CRUDO QUESOS S.L.U',
  vat_id: 'B-19953694',
  address: 'Calle Jose Ortega y Gasset 81, 28006 Madrid',
  city: 'Madrid',
  country: 'ES',
  hours: {
    mon: '17:30-23:00',
    tue: '17:30-23:00',
    wed: '17:30-23:00',
    thu: '17:30-23:00',
    fri: '17:30-23:00',
    sat: '12:30-22:00',
    sun: '12:30-20:00',
    notes: 'Cierre las dos ultimas semanas de agosto.',
  },
  pickup: {
    sla_text: 'Confirmamos por WhatsApp en menos de 24 horas dentro del horario de apertura.',
  },
  contact: {
    whatsapp_public: null,
    instagram: 'https://www.instagram.com/crudoquesos',
    google_maps_url: null,
  },
  flags: {
    pickup_enabled: true,
    pickup_paused: false,
    pickup_daily_capacity: 15,
  },
};

export async function fetchSiteConfig() {
  const res = await api.get('/site/config');
  return res.data;
}
