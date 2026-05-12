'use strict';

const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
const { validateRequest } = require('../middleware/validate-request');
const inquiriesController = require('../controllers/inquiries.controller');
const inquiriesValidator = require('../validators/inquiries.validator');

const router = express.Router();

router.post(
  '/',
  validateRequest(inquiriesValidator.create),
  asyncHandler(inquiriesController.create),
);

module.exports = router;
