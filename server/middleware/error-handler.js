'use strict';

const { createProblem } = require('../utils/problem');
const env = require('../config/env');

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const isProduction = env.NODE_ENV === 'production';

  const problem = createProblem({
    status,
    title: err.title || httpTitle(status),
    detail: err.detail || (!isProduction ? err.message : 'An unexpected error occurred.'),
    instance: req.path,
    extra: err.extra || {},
  });

  res.status(status).type('application/problem+json').json(problem);
}

function httpTitle(status) {
  const titles = {
    400: 'Bad Request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not Found',
    409: 'Conflict',
    422: 'Unprocessable Entity',
    429: 'Too Many Requests',
    500: 'Internal Server Error',
  };
  return titles[status] || 'Error';
}

module.exports = { errorHandler };
