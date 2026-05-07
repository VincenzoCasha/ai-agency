'use strict';

const path = require('path');
const fs = require('fs');

require('./server/config/env'); // loads dotenv first
const env = require('./server/config/env');
const app = require('./server/app');
const { closePool } = require('./db/pool');

const PORT = env.PORT;

// Serve static frontend build (dist/) in production if it exists
if (env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, 'dist');
  if (fs.existsSync(distPath)) {
    const express = require('express');
    app.use(express.static(distPath));
    // SPA fallback — serve index.html for any non-API route
    app.get(/^(?!\/api).*/, (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }
}

const server = app.listen(PORT, () => {
  console.log(`[crudo-api] running on port ${PORT} (${env.NODE_ENV})`);
});

async function gracefulShutdown(signal) {
  console.log(`[crudo-api] ${signal} received — shutting down`);
  server.close(async () => {
    await closePool();
    process.exit(0);
  });
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = server;
