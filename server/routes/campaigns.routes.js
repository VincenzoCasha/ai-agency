'use strict';

const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
const { validateRequest } = require('../middleware/validate-request');
const { publicCache } = require('../utils/cache-control');
const campaignsController = require('../controllers/campaigns.controller');
const { slugRule } = require('../validators/common.validator');

const router = express.Router();

router.get('/active', publicCache(), asyncHandler(campaignsController.getActive));

router.get(
  '/:slug',
  publicCache(),
  validateRequest({ params: { slug: slugRule } }),
  asyncHandler(campaignsController.getBySlug),
);

module.exports = router;
