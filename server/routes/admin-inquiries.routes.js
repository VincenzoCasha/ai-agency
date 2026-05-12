'use strict';

const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
const { validateRequest } = require('../middleware/validate-request');
const { withAdminErrors } = require('../utils/admin-errors');
const controller = require('../controllers/admin-inquiries.controller');
const status = require('../validators/admin-status.validator');

const router = express.Router();

router.get('/',         validateRequest(status.inquiryList),  withAdminErrors(asyncHandler(controller.list)));
router.patch('/:id',    validateRequest(status.inquiryStatus), withAdminErrors(asyncHandler(controller.patch)));

module.exports = router;
