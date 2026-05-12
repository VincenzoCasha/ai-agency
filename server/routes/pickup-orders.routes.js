'use strict';

const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
const { validateRequest } = require('../middleware/validate-request');
const pickupController = require('../controllers/pickup-orders.controller');
const pickupValidator = require('../validators/pickup-orders.validator');

const router = express.Router();

router.post(
  '/',
  validateRequest(pickupValidator.create),
  asyncHandler(pickupController.create),
);

module.exports = router;
