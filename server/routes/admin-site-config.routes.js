'use strict';

const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
const { validateRequest } = require('../middleware/validate-request');
const { withAdminErrors } = require('../utils/admin-errors');
const controller = require('../controllers/admin-site-config.controller');
const validators = require('../validators/admin-site-config.validator');

const router = express.Router();

router.get('/config', withAdminErrors(asyncHandler(controller.get)));
router.put('/config', validateRequest(validators.update), withAdminErrors(asyncHandler(controller.update)));

module.exports = router;
