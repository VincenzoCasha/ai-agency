'use strict';

const service = require('../services/admin-event-reservation.service');

async function list(req, res) {
  res.json(await service.paginate({
    page: req.query.page, size: req.query.size,
    eventId: req.query.event_id, status: req.query.status,
  }));
}

async function patch(req, res) {
  res.json(await service.updateStatus(req.admin.id, req.params.id, req.body.status));
}

module.exports = { list, patch };
