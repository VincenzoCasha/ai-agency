'use strict';

const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
const { publicCache } = require('../utils/cache-control');
const siteConfigController = require('../controllers/site-config.controller');

const router = express.Router();

router.get('/config', publicCache(), asyncHandler(siteConfigController.get));

module.exports = router;
