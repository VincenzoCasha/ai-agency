'use strict';

const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
const { validateRequest } = require('../middleware/validate-request');
const newsletterController = require('../controllers/newsletter.controller');
const newsletterValidator = require('../validators/newsletter.validator');

const router = express.Router();

router.post(
  '/subscribe',
  validateRequest(newsletterValidator.subscribe),
  asyncHandler(newsletterController.subscribe),
);

module.exports = router;
