'use strict';

/**
 * Entry point del monolito CRUDO V1.
 *
 * En produccion sirve la SPA construida en `dist/` con fallback a
 * `index.html`, pero ese fallback NUNCA intercepta `/api/v1/*` ni
 * `/uploads/*`. Si `dist/` no existe (por ejemplo despues de un deploy sin
 * `npm run build`), arranca solo la API y deja un aviso claro en logs.
 */

const path = require('path');
const fs = require('fs');

require('./server/config/env'); // loads dotenv first
const env = require('./server/config/env');
const app = require('./server/app');
const { mountFinalHandlers } = require('./server/app');
const { closePool } = require('./db/pool');

const PORT = env.PORT;

function mountStaticDist() {
  if (env.NODE_ENV !== 'production') return;
  const distPath = path.join(__dirname, 'dist');
  const indexHtml = path.join(distPath, 'index.html');

  if (!fs.existsSync(indexHtml)) {
     
    console.warn(
      `[crudo-api] AVISO: ${indexHtml} no encontrado. La API arrancara sin SPA. ` +
      'Ejecuta `npm run build` o despliega `dist/` para servir el frontend.',
    );
    return;
  }

  const express = require('express');

  // Activos hashados: cache largo. `index.html`: no-cache para que cada deploy
  // entregue el bundle correcto.
  app.use(express.static(distPath, {
    index: false,
    maxAge: '30d',
    setHeaders(res, filePath) {
      if (filePath.endsWith('index.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    },
  }));

  // SPA fallback solo para rutas que no sean API ni uploads.
  app.get(/^(?!\/api\/|\/uploads\/).*/, (req, res) => {
    res.sendFile(indexHtml);
  });

   
  console.log(`[crudo-api] sirviendo SPA desde ${distPath}`);
}

mountStaticDist();

// En produccion, los handlers finales (404 + errorHandler) se registran aqui,
// despues de la SPA, para que `dist/index.html` capture rutas no-API.
if (env.NODE_ENV === 'production') {
  mountFinalHandlers();
}

const server = app.listen(PORT, () => {
   
  console.log(`[crudo-api] running on port ${PORT} (${env.NODE_ENV})`);
});

async function gracefulShutdown(signal) {
   
  console.log(`[crudo-api] ${signal} received — shutting down`);
  // Forzar cierre tras 10s si algo se queda colgado.
  const failsafe = setTimeout(() => process.exit(1), 10000);
  failsafe.unref();
  server.close(async () => {
    try {
      await closePool();
    } catch (err) {
       
      console.warn(`[crudo-api] cerrando pool: ${err.message}`);
    }
    process.exit(0);
  });
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = server;
