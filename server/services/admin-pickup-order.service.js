'use strict';

const pickupRepo = require('../repositories/pickup-order.repository');
const audit = require('./audit.service');
const { AdminError } = require('./admin-product.service');

const ALLOWED_STATUSES = ['NEW', 'CONFIRMED', 'READY', 'PICKED_UP', 'CANCELLED'];

async function paginate(opts) {
  return pickupRepo.adminPaginate(opts);
}

async function getById(id) {
  const order = await pickupRepo.findById(Number(id));
  if (!order) throw new AdminError(404, 'PICKUP_NOT_FOUND', 'Pedido pickup no encontrado.');
  const items = await pickupRepo.listItems(order.id);
  return { ...order, items };
}

async function updateStatus(adminId, id, status) {
  if (!ALLOWED_STATUSES.includes(status)) {
    throw new AdminError(422, 'INVALID_STATUS', `Status no permitido. Debe ser uno de: ${ALLOWED_STATUSES.join(', ')}`);
  }
  const current = await pickupRepo.findById(Number(id));
  if (!current) throw new AdminError(404, 'PICKUP_NOT_FOUND', 'Pedido pickup no encontrado.');
  await pickupRepo.updateStatus(current.id, status);
  await audit.log({
    actorAdminUserId: adminId,
    action: 'pickup_order.status_update',
    entityType: 'pickup_order',
    entityId: current.id,
    payload: { from: current.status, to: status },
  });
  return getById(current.id);
}

module.exports = { paginate, getById, updateStatus, ALLOWED_STATUSES };
