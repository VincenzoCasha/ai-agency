'use strict';

const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
const { validateRequest } = require('../middleware/validate-request');
const { withAdminErrors } = require('../utils/admin-errors');
const controller = require('../controllers/admin-campaigns.controller');
const validators = require('../validators/admin-campaigns.validator');

const router = express.Router();

router.get('/',         validateRequest(validators.list),    withAdminErrors(asyncHandler(controller.list)));
router.post('/',        validateRequest(validators.create),  withAdminErrors(asyncHandler(controller.create)));
router.get('/:id',      validateRequest(validators.idParam), withAdminErrors(asyncHandler(controller.get)));
router.put('/:id',      validateRequest(validators.update),  withAdminErrors(asyncHandler(controller.update)));
router.delete('/:id',   validateRequest(validators.idParam), withAdminErrors(asyncHandler(controller.softDelete)));

module.exports = router;
