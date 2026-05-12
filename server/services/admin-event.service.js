'use strict';

const eventRepo = require('../repositories/event.repository');
const audit = require('./audit.service');
const { AdminError } = require('./admin-product.service');

function validateDates(data) {
  if (data.starts_at && data.ends_at) {
    const s = new Date(data.starts_at);
    const e = new Date(data.ends_at);
    if (Number.isNaN(s.getTime()) || Number.isNaN(e.getTime())) {
      throw new AdminError(422, 'INVALID_DATES', 'starts_at o ends_at no son fechas validas.');
    }
    if (e.getTime() < s.getTime()) {
      throw new AdminError(422, 'ENDS_BEFORE_STARTS', 'ends_at debe ser igual o posterior a starts_at.');
    }
  }
}

async function paginate(opts) {
  return eventRepo.adminPaginate(opts);
}

async function getById(id) {
  const ev = await eventRepo.findById(Number(id));
  if (!ev) throw new AdminError(404, 'EVENT_NOT_FOUND', 'Evento no encontrado.');
  return ev;
}

async function create(adminId, data) {
  validateDates(data);
  if (await eventRepo.existsSlug(data.slug)) {
    throw new AdminError(409, 'SLUG_CONFLICT', `Ya existe un evento con slug '${data.slug}'.`);
  }
  const id = await eventRepo.create(data);
  await audit.log({
    actorAdminUserId: adminId,
    action: 'event.create',
    entityType: 'event',
    entityId: id,
    payload: { slug: data.slug, title: data.title },
  });
  return getById(id);
}

async function update(adminId, id, data) {
  const current = await eventRepo.findById(Number(id));
  if (!current) throw new AdminError(404, 'EVENT_NOT_FOUND', 'Evento no encontrado.');
  validateDates({ ...current, ...data });
  if (data.slug && data.slug !== current.slug) {
    if (await eventRepo.existsSlug(data.slug, current.id)) {
      throw new AdminError(409, 'SLUG_CONFLICT', `Ya existe un evento con slug '${data.slug}'.`);
    }
  }
  await eventRepo.update(current.id, data);
  await audit.log({
    actorAdminUserId: adminId,
    action: 'event.update',
    entityType: 'event',
    entityId: current.id,
    payload: { changed_keys: Object.keys(data) },
  });
  return getById(current.id);
}

async function softDelete(adminId, id) {
  const current = await eventRepo.findById(Number(id));
  if (!current) throw new AdminError(404, 'EVENT_NOT_FOUND', 'Evento no encontrado.');
  await eventRepo.setActive(current.id, false);
  await audit.log({
    actorAdminUserId: adminId,
    action: 'event.soft_delete',
    entityType: 'event',
    entityId: current.id,
  });
  return { id: current.id, is_active: false };
}

module.exports = { paginate, getById, create, update, softDelete };
