'use strict';

/**
 * Site config publico para el frontend.
 * Combina:
 *  - flags runtime de la tabla `site_config` (pickup_paused, pickup_daily_capacity)
 *  - valores publicos desde env (`PUBLIC_*`)
 *  - constantes/placeholders documentados en V1Tecnico.md (datos fiscales,
 *    horarios, SLA pickup) para alimentar al frontend antes de tener fuentes
 *    finales.
 *
 * NUNCA expone secretos, emails privados o credenciales.
 */

const siteConfigRepo = require('../repositories/site-config.repository');
const env = require('../config/env');

const STATIC_PUBLIC_INFO = {
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
};

function asBool(value) {
  if (value === true || value === 'true' || value === '1' || value === 1) return true;
  return false;
}

async function getPublicConfig() {
  const cfg = await siteConfigRepo.getAll();
  const pickupPaused = asBool(cfg.pickup_paused);
  const pickupDailyCapacity = cfg.pickup_daily_capacity ? Number(cfg.pickup_daily_capacity) : 15;

  return {
    ...STATIC_PUBLIC_INFO,
    contact: {
      whatsapp_public: env.PUBLIC_WHATSAPP || null,
      instagram: env.PUBLIC_INSTAGRAM || null,
      google_maps_url: env.PUBLIC_GOOGLE_MAPS_URL || null,
    },
    flags: {
      pickup_enabled: !pickupPaused,
      pickup_paused: pickupPaused,
      pickup_daily_capacity: pickupDailyCapacity,
    },
  };
}

module.exports = { getPublicConfig, STATIC_PUBLIC_INFO };
