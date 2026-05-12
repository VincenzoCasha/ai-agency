'use strict';

const express = require('express');
const rateLimit = require('express-rate-limit');
const { asyncHandler } = require('../middleware/async-handler');
const { validateRequest } = require('../middleware/validate-request');
const env = require('../config/env');
const controller = require('../controllers/admin-auth.controller');
const validators = require('../validators/admin-auth.validator');

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skip: () => env.NODE_ENV === 'test',
  message: {
    type: 'https://crudo.es/errors/429',
    title: 'Too Many Requests',
    status: 429,
    detail: 'Demasiados intentos de login. Espera un minuto antes de reintentar.',
  },
});

router.post('/login', loginLimiter, validateRequest(validators.login), asyncHandler(controller.login));
router.post('/refresh', validateRequest(validators.refresh), asyncHandler(controller.refresh));
router.post('/logout', validateRequest(validators.logout), asyncHandler(controller.logout));

module.exports = router;
