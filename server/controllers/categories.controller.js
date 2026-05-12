'use strict';

const catalogService = require('../services/catalog.service');

async function list(req, res) {
  const items = await catalogService.listCategories(req.query.type);
  res.json({ items });
}

module.exports = { list };
