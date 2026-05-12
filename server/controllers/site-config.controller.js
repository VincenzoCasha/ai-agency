'use strict';

const siteConfigService = require('../services/site-config.service');

async function get(req, res) {
  const config = await siteConfigService.getPublicConfig();
  res.json(config);
}

module.exports = { get };
