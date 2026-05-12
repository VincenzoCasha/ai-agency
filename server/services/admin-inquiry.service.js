'use strict';

const inquiryRepo = require('../repositories/inquiry.repository');
const audit = require('./audit.service');
const { AdminError } = require('./admin-product.service');

const ALLOWED_STATUSES = ['NEW', 'IN_PROGRESS', 'DONE', 'SPAM'];

async function paginate(opts) {
  return inquiryRepo.adminPaginate(opts);
}

async function updateStatus(adminId, id, status) {
  if (!ALLOWED_STATUSES.includes(status)) {
    throw new AdminError(422, 'INVALID_STATUS', `Status no permitido. Debe ser uno de: ${ALLOWED_STATUSES.join(', ')}`);
  }
  const current = await inquiryRepo.findById(Number(id));
  if (!current) throw new AdminError(404, 'INQUIRY_NOT_FOUND', 'Consulta no encontrada.');
  await inquiryRepo.updateStatus(current.id, status);
  await audit.log({
    actorAdminUserId: adminId,
    action: 'inquiry.status_update',
    entityType: 'inquiry',
    entityId: current.id,
    payload: { from: current.status, to: status },
  });
  return { ...current, status };
}

module.exports = { paginate, updateStatus, ALLOWED_STATUSES };
