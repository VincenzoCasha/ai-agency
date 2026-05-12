'use strict';

const authService = require('../services/auth.service');
const audit = require('../services/audit.service');
const { sendKnownProblem } = require('../utils/admin-errors');

function getReqMeta(req) {
  return {
    ip: req.ip || req.headers['x-forwarded-for']?.split(',')[0]?.trim() || null,
    userAgent: req.headers['user-agent'] || null,
  };
}

async function login(req, res, next) {
  const { email, password } = req.body;
  const meta = getReqMeta(req);
  try {
    const result = await authService.login({ email, password, ...meta });
    await audit.log({
      actorAdminUserId: result.admin.id,
      action: 'auth.login_success',
      entityType: 'admin_user',
      entityId: result.admin.id,
    });
    res.status(200).json(result);
  } catch (err) {
    if (err.status === 401) {
      await audit.log({
        actorAdminUserId: null,
        action: 'auth.login_failed',
        entityType: 'admin_user',
        payload: { email },
      }).catch(() => null);
      sendKnownProblem(err, req, res);
      return;
    }
    next(err);
  }
}

async function refresh(req, res, next) {
  const meta = getReqMeta(req);
  try {
    const result = await authService.refresh({ refreshToken: req.body.refresh_token, ...meta });
    res.status(200).json(result);
  } catch (err) {
    if (err.status === 401) return sendKnownProblem(err, req, res);
    next(err);
  }
}

async function logout(req, res) {
  await authService.logout({ refreshToken: req.body.refresh_token });
  res.status(204).end();
}

module.exports = { login, refresh, logout };
