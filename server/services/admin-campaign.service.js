'use strict';

const campaignRepo = require('../repositories/campaign.repository');
const audit = require('./audit.service');
const { AdminError } = require('./admin-product.service');

async function paginate(opts) {
  return campaignRepo.adminPaginate(opts);
}

async function getById(id) {
  const c = await campaignRepo.findById(Number(id));
  if (!c) throw new AdminError(404, 'CAMPAIGN_NOT_FOUND', 'Campana no encontrada.');
  const products = await campaignRepo.listProducts(c.id);
  return { ...c, products };
}

async function ensureSingleActive(exceptId) {
  const others = await campaignRepo.countActiveOthers(exceptId);
  if (others > 0) {
    throw new AdminError(
      409,
      'ANOTHER_CAMPAIGN_ACTIVE',
      'Ya hay otra campana activa en la ventana actual. Desactiva la anterior antes de activar esta.',
    );
  }
}

async function create(adminId, data) {
  if (await campaignRepo.existsSlug(data.slug)) {
    throw new AdminError(409, 'SLUG_CONFLICT', `Ya existe una campana con slug '${data.slug}'.`);
  }
  if (data.is_active !== false) {
    await ensureSingleActive();
  }
  const id = await campaignRepo.create(data);
  if (Array.isArray(data.product_ids)) {
    await campaignRepo.setProducts(id, data.product_ids);
  }
  await audit.log({
    actorAdminUserId: adminId,
    action: 'campaign.create',
    entityType: 'campaign',
    entityId: id,
    payload: { slug: data.slug, is_active: data.is_active !== false },
  });
  return getById(id);
}

async function update(adminId, id, data) {
  const current = await campaignRepo.findById(Number(id));
  if (!current) throw new AdminError(404, 'CAMPAIGN_NOT_FOUND', 'Campana no encontrada.');
  if (data.slug && data.slug !== current.slug) {
    if (await campaignRepo.existsSlug(data.slug, current.id)) {
      throw new AdminError(409, 'SLUG_CONFLICT', `Ya existe una campana con slug '${data.slug}'.`);
    }
  }
  if (data.is_active === true && !current.is_active) {
    await ensureSingleActive(current.id);
  }
  await campaignRepo.update(current.id, data);
  if (Array.isArray(data.product_ids)) {
    await campaignRepo.setProducts(current.id, data.product_ids);
  }
  await audit.log({
    actorAdminUserId: adminId,
    action: 'campaign.update',
    entityType: 'campaign',
    entityId: current.id,
    payload: { changed_keys: Object.keys(data) },
  });
  return getById(current.id);
}

async function softDelete(adminId, id) {
  const current = await campaignRepo.findById(Number(id));
  if (!current) throw new AdminError(404, 'CAMPAIGN_NOT_FOUND', 'Campana no encontrada.');
  await campaignRepo.setActive(current.id, false);
  await audit.log({
    actorAdminUserId: adminId,
    action: 'campaign.soft_delete',
    entityType: 'campaign',
    entityId: current.id,
  });
  return { id: current.id, is_active: false };
}

module.exports = { paginate, getById, create, update, softDelete };
