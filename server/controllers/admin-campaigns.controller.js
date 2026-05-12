'use strict';

const service = require('../services/admin-campaign.service');

async function list(req, res) {
  res.json(await service.paginate({
    page: req.query.page, size: req.query.size,
    isActive: req.query.is_active, q: req.query.q,
  }));
}
async function get(req, res)    { res.json(await service.getById(req.params.id)); }
async function create(req, res) { res.status(201).json(await service.create(req.admin.id, req.body)); }
async function update(req, res) { res.json(await service.update(req.admin.id, req.params.id, req.body)); }
async function softDelete(req, res) { res.json(await service.softDelete(req.admin.id, req.params.id)); }

module.exports = { list, get, create, update, softDelete };
