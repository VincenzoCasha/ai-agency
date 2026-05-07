'use strict';

const { createProblem } = require('../utils/problem');

function notFound(req, res) {
  const problem = createProblem({
    status: 404,
    title: 'Not Found',
    detail: `Cannot ${req.method} ${req.path}`,
    instance: req.path,
  });
  res.status(404).type('application/problem+json').json(problem);
}

module.exports = { notFound };
