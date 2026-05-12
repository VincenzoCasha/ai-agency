'use strict';

/**
 * Event service.
 * Reglas:
 *  - Solo eventos futuros + activos se exponen.
 *  - `seats_left` = capacity - sum(party_size de reservas NEW/CONFIRMED).
 *  - `few_seats_left=true` cuando seats_left < 30% de capacity.
 *  - Reservas se rechazan si evento esta lleno (422).
 */

const eventRepo = require('../repositories/event.repository');

async function decorate(event) {
  if (!event) return null;
  const taken = await eventRepo.countSeatsTaken(event.id);
  const seatsLeft = Math.max(0, event.capacity - taken);
  const fewSeatsLeft = event.capacity > 0 && seatsLeft < event.capacity * 0.3;
  return { ...event, seats_left: seatsLeft, few_seats_left: fewSeatsLeft, is_full: seatsLeft === 0 };
}

async function listUpcoming(limit) {
  const events = await eventRepo.listUpcomingActive({ limit });
  return Promise.all(events.map(decorate));
}

async function getActiveBySlug(slug) {
  const ev = await eventRepo.findActiveUpcomingBySlug(slug);
  if (!ev) return null;
  return decorate(ev);
}

/**
 * Crea reserva. Devuelve `{ id, event }` o lanza error con `status` apropiado.
 *  - 404 si evento no existe / no activo / pasado.
 *  - 422 si evento lleno o party_size > seats_left.
 */
async function createReservation(slug, payload) {
  const event = await eventRepo.findActiveUpcomingBySlug(slug);
  if (!event) {
    const err = new Error('Evento no encontrado o no disponible');
    err.status = 404;
    throw err;
  }

  const decorated = await decorate(event);
  if (decorated.is_full) {
    const err = new Error('El evento esta lleno');
    err.status = 422;
    err.detail = 'No quedan plazas disponibles para este evento.';
    err.extra = { code: 'EVENT_FULL', seats_left: 0 };
    throw err;
  }
  if (payload.party_size > decorated.seats_left) {
    const err = new Error('Plazas insuficientes');
    err.status = 422;
    err.detail = `Solo quedan ${decorated.seats_left} plazas para este evento.`;
    err.extra = { code: 'NOT_ENOUGH_SEATS', seats_left: decorated.seats_left };
    throw err;
  }

  const id = await eventRepo.createReservation({
    eventId: event.id,
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    partySize: payload.party_size,
    notes: payload.notes,
  });

  return { id, event: decorated };
}

module.exports = { listUpcoming, getActiveBySlug, createReservation, decorate };
