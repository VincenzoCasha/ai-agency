'use strict';

const service = require('../services/admin-pickup-order.service');

async function list(req, res) {
  res.json(await service.paginate({
    page: req.query.page, size: req.query.size,
    status: req.query.status,
    fromDate: req.query.from_date, toDate: req.query.to_date,
    q: req.query.q,
  }));
}

async function get(req, res) {
  res.json(await service.getById(req.params.id));
}

async function patch(req, res) {
  res.json(await service.updateStatus(req.admin.id, req.params.id, req.body.status));
}

module.exports = { list, get, patch };
