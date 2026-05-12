'use strict';

/**
 * Middleware de autenticacion admin.
 * Lee `Authorization: Bearer <token>` y valida con jwtService. Si todo va
 * bien, anade `req.admin` con `{ id, email, role }`. Caso contrario devuelve
 * 401 RFC 7807.
 */

const authService = require('../services/auth.service');
const { createProblem } = require('../utils/problem');

function unauthorized(res, instance, code = 'UNAUTHORIZED', detail = 'Autenticacion requerida.') {
  const problem = createProblem({
    status: 401,
    title: 'Unauthorized',
    detail,
    instance,
    extra: { code },
  });
  return res.status(401).type('application/problem+json').json(problem);
}

function authenticateAdmin(req, res, next) {
  const auth = req.get('Authorization') || '';
  if (!auth.startsWith('Bearer ')) {
    return unauthorized(res, req.path, 'TOKEN_MISSING', 'Falta el header Authorization Bearer.');
  }
  const token = auth.slice('Bearer '.length).trim();
  if (!token) {
    return unauthorized(res, req.path, 'TOKEN_MISSING');
  }
  authService
    .loadAdminFromAccessToken(token)
    .then((admin) => {
      req.admin = { id: admin.id, email: admin.email, role: admin.role };
      next();
    })
    .catch((err) => {
      return unauthorized(res, req.path, err.extra?.code || 'TOKEN_INVALID', err.detail || err.message);
    });
}

function requireRole(...allowed) {
  return (req, res, next) => {
    if (!req.admin) return unauthorized(res, req.path, 'TOKEN_MISSING');
    if (!allowed.includes(req.admin.role)) {
      const problem = createProblem({
        status: 403,
        title: 'Forbidden',
        detail: 'Tu rol no tiene permisos para esta accion.',
        instance: req.path,
        extra: { code: 'FORBIDDEN_ROLE' },
      });
      return res.status(403).type('application/problem+json').json(problem);
    }
    next();
  };
}

module.exports = { authenticateAdmin, requireRole };
