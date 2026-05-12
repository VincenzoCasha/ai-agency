'use strict';

const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
const { validateRequest } = require('../middleware/validate-request');
const consentController = require('../controllers/consent.controller');
const consentValidator = require('../validators/consent.validator');

const router = express.Router();

router.post(
  '/',
  validateRequest(consentValidator.record),
  asyncHandler(consentController.record),
);

module.exports = router;
