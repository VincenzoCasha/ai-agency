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
  domain: 'crudomov.es',
  hours: {
    mon: '17:30-22:30',
    tue: '17:30-22:30',
    wed: '17:30-22:30',
    thu: '17:30-22:30',
    fri: '17:30-22:30',
    sat: '12:30-22:00',
    sun: '12:30-20:00',
    notes: 'Cierre las dos ultimas semanas de agosto.',
  },
  pickup: {
    sla_text: 'Confirmamos por WhatsApp en menos de 24 horas dentro del horario de apertura.',
  },
  contact: {
    whatsapp_public: '+34 650 13 18 61',
    whatsapp_owner: '+34 662 51 74 90',
    email: 'crudomov@gmail.com',
    instagram: 'https://www.instagram.com/crudomov',
    google_maps_url: 'https://maps.google.com/?q=Calle+Jose+Ortega+y+Gasset+81+Madrid',
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
