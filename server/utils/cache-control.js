'use strict';

/**
 * Middleware factory para Cache-Control en endpoints publicos cacheables.
 * Default: max-age 5min con stale-while-revalidate de 60s, segun la spec V1.
 */
function publicCache({ maxAge = 300, swr = 60 } = {}) {
  return (req, res, next) => {
    res.setHeader('Cache-Control', `public, max-age=${maxAge}, stale-while-revalidate=${swr}`);
    next();
  };
}

module.exports = { publicCache };
