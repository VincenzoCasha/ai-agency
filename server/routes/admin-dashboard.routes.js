'use strict';

const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
const { validateRequest } = require('../middleware/validate-request');
const controller = require('../controllers/admin-dashboard.controller');
const statusValidators = require('../validators/admin-status.validator');

const router = express.Router();

router.get('/dashboard', asyncHandler(controller.getDashboard));
router.get('/kpis', validateRequest(statusValidators.kpis), asyncHandler(controller.getKpis));

module.exports = router;
