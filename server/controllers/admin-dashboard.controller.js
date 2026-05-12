'use strict';

const dashboard = require('../services/admin-dashboard.service');

async function getDashboard(req, res) {
  const data = await dashboard.getDashboard();
  res.json(data);
}

async function getKpis(req, res) {
  const data = await dashboard.getKpis({ period: req.query.period });
  res.json(data);
}

module.exports = { getDashboard, getKpis };
