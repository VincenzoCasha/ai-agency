'use strict';

const { createProblem } = require('../utils/problem');

/**
 * Centralised request validator placeholder.
 * In Phase 3+ each route will pass a rules object; this middleware
 * runs the rules and returns RFC 7807 on failure.
 *
 * Usage (future phases):
 *   router.post('/pickup-orders', validateRequest(pickupOrderRules), controller)
 */
function validateRequest(rules) {
  return (req, res, next) => {
    if (!rules) return next();

    const errors = [];

    for (const [field, checks] of Object.entries(rules)) {
      const value = req.body?.[field] ?? req.query?.[field] ?? req.params?.[field];

      if (checks.required && (value === undefined || value === null || value === '')) {
        errors.push({ field, message: `${field} is required` });
        continue;
      }

      if (checks.type && value !== undefined) {
        if (checks.type === 'number' && isNaN(Number(value))) {
          errors.push({ field, message: `${field} must be a number` });
        }
        if (checks.type === 'string' && typeof value !== 'string') {
          errors.push({ field, message: `${field} must be a string` });
        }
      }
    }

    if (errors.length) {
      const problem = createProblem({
        status: 400,
        title: 'Bad Request',
        detail: 'One or more request fields are invalid.',
        instance: req.path,
        extra: { errors },
      });
      return res.status(400).type('application/problem+json').json(problem);
    }

    next();
  };
}

module.exports = { validateRequest };
