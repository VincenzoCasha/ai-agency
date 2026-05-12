'use strict';

const eventRepo = require('../repositories/event.repository');
const audit = require('./audit.service');
const { AdminError } = require('./admin-product.service');

const ALLOWED_STATUSES = ['NEW', 'CONFIRMED', 'CANCELLED'];

async function paginate(opts) {
  return eventRepo.listReservationsForAdmin(opts);
}

async function updateStatus(adminId, id, status) {
  if (!ALLOWED_STATUSES.includes(status)) {
    throw new AdminError(422, 'INVALID_STATUS', `Status no permitido. Debe ser uno de: ${ALLOWED_STATUSES.join(', ')}`);
  }
  const current = await eventRepo.findReservationById(Number(id));
  if (!current) throw new AdminError(404, 'RESERVATION_NOT_FOUND', 'Reserva no encontrada.');
  await eventRepo.updateReservationStatus(current.id, status);
  await audit.log({
    actorAdminUserId: adminId,
    action: 'event_reservation.status_update',
    entityType: 'event_reservation',
    entityId: current.id,
    payload: { from: current.status, to: status, event_id: current.event_id },
  });
  return { ...current, status };
}

module.exports = { paginate, updateStatus, ALLOWED_STATUSES };
