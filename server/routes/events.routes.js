'use strict';

const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
const { validateRequest } = require('../middleware/validate-request');
const { publicCache } = require('../utils/cache-control');
const eventsController = require('../controllers/events.controller');
const eventsValidator = require('../validators/events.validator');

const router = express.Router();

router.get('/', publicCache(), asyncHandler(eventsController.list));

router.get(
  '/:slug',
  publicCache(),
  validateRequest(eventsValidator.eventSlugParam),
  asyncHandler(eventsController.getBySlug),
);

router.post(
  '/:slug/reservations',
  validateRequest(eventsValidator.createReservation),
  asyncHandler(eventsController.createReservation),
);

module.exports = router;
