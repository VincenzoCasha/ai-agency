'use strict';

/**
 * Notification service — adaptador noop para Fase 3.
 *
 * Expone metodos para que la API publica avise al owner cuando hay nuevas
 * inquiries, reservas de eventos o suscripciones. La integracion real con
 * email transaccional / WhatsApp llegara en fases posteriores.
 *
 * En tests, los metodos guardan los eventos en memoria (`sink`) para poder
 * verificar que se llamaron. En desarrollo se loguean. En produccion son
 * noop pasivo hasta tener un proveedor real, sin bloquear la peticion.
 */

const env = require('../config/env');

const sink = [];

function shouldStoreSink() {
  return env.NODE_ENV === 'test';
}

function log(level, msg) {
  if (env.NODE_ENV === 'test') return;
   
  console[level === 'warn' ? 'warn' : 'log'](msg);
}

async function notifyNewInquiry(payload) {
  if (shouldStoreSink()) sink.push({ kind: 'new_inquiry', payload });
  log('info', `[notify] inquiry id=${payload.id} type=${payload.type}`);
  return { ok: true };
}

async function notifyNewEventReservation(payload) {
  if (shouldStoreSink()) sink.push({ kind: 'new_event_reservation', payload });
  log('info', `[notify] event reservation id=${payload.id} event=${payload.eventSlug}`);
  return { ok: true };
}

async function notifyNewNewsletterSubscriber(payload) {
  if (shouldStoreSink()) sink.push({ kind: 'new_newsletter_subscriber', payload });
  log('info', `[notify] newsletter subscriber email=${payload.email}`);
  return { ok: true };
}

async function notifyNewPickupOrder(payload) {
  if (shouldStoreSink()) sink.push({ kind: 'new_pickup_order', payload });
  log(
    'info',
    `[notify] pickup order id=${payload.id} date=${payload.pickup_date} slot=${payload.pickup_slot} total=${payload.total_cents}c items=${payload.items?.length || 0}`,
  );
  return { ok: true };
}

function _drainSink() {
  const out = sink.slice();
  sink.length = 0;
  return out;
}

module.exports = {
  notifyNewInquiry,
  notifyNewEventReservation,
  notifyNewNewsletterSubscriber,
  notifyNewPickupOrder,
  _drainSink,
};
