'use strict';

const service = require('../services/admin-inquiry.service');

async function list(req, res) {
  res.json(await service.paginate({
    page: req.query.page, size: req.query.size,
    status: req.query.status, type: req.query.type, q: req.query.q,
  }));
}

async function patch(req, res) {
  const inquiry = await service.updateStatus(req.admin.id, req.params.id, req.body.status);
  res.json(inquiry);
}

module.exports = { list, patch };
