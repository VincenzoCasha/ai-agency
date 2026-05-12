'use strict';

const service = require('../services/admin-site-config.service');

async function get(req, res) {
  const config = await service.getAll();
  res.json({ config });
}

async function update(req, res) {
  const updated = await service.update(req.admin.id, req.body);
  res.json({ config: updated });
}

module.exports = { get, update };
