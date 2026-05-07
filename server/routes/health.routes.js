'use strict';

const { Router } = require('express');
const { healthCheck } = require('../controllers/health.controller');
const { asyncHandler } = require('../middleware/async-handler');

const router = Router();

router.get('/', asyncHandler(healthCheck));

module.exports = router;
