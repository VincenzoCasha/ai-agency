'use strict';

const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
const { validateRequest } = require('../middleware/validate-request');
const { withAdminErrors } = require('../utils/admin-errors');
const controller = require('../controllers/admin-pickup-orders.controller');
const status = require('../validators/admin-status.validator');

const router = express.Router();

router.get('/',         validateRequest(status.pickupList),    withAdminErrors(asyncHandler(controller.list)));
router.get('/:id',      validateRequest(status.idParam),       withAdminErrors(asyncHandler(controller.get)));
router.patch('/:id',    validateRequest(status.pickupStatus),  withAdminErrors(asyncHandler(controller.patch)));

module.exports = router;
