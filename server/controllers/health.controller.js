'use strict';

const { getHealthStatus } = require('../services/health.service');

async function healthCheck(req, res) {
  const health = await getHealthStatus();
  const httpStatus = health.status === 'ok' ? 200 : 200; // 200 even degraded; DB down != API down
  res.status(httpStatus).json(health);
}

module.exports = { healthCheck };
