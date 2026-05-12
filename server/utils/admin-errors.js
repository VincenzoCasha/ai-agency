'use strict';

const { createProblem } = require('./problem');

const TITLE_BY_STATUS = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
  422: 'Unprocessable Entity',
};

/**
 * Convierte errores con `status/code/detail/extra` (lanzados por los servicios
 * admin) en una respuesta `application/problem+json`. Devuelve true si el
 * error fue mapeado y la respuesta enviada; false en caso contrario para
 * permitir que pase al error handler global.
 */
function sendKnownProblem(err, req, res) {
  const status = err.status;
  if (![400, 401, 403, 404, 409, 422].includes(status)) return false;
  const code = err.extra?.code;
  const problem = createProblem({
    status,
    title: err.title || TITLE_BY_STATUS[status] || 'Error',
    detail: err.detail || err.message,
    instance: req.path,
    extra: { ...(code ? { code } : {}), ...(err.extra || {}) },
  });
  res.status(status).type('application/problem+json').json(problem);
  return true;
}

function withAdminErrors(handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (err) {
      if (sendKnownProblem(err, req, res)) return;
      return next(err);
    }
  };
}

module.exports = { sendKnownProblem, withAdminErrors };
