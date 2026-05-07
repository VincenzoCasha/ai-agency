'use strict';

const { pingDatabase } = require('../../db/pool');
const env = require('../config/env');

async function getHealthStatus() {
  let dbStatus = 'skipped';

  if (env.NODE_ENV !== 'test') {
    try {
      await pingDatabase();
      dbStatus = 'ok';
    } catch {
      dbStatus = 'error';
    }
  }

  const overallStatus = dbStatus === 'error' ? 'degraded' : 'ok';

  return {
    status: overallStatus,
    service: 'crudo-api',
    version: process.env.npm_package_version || '1.0.0',
    environment: env.NODE_ENV,
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    checks: {
      database: { status: dbStatus },
    },
  };
}

module.exports = { getHealthStatus };
