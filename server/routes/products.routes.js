'use strict';

const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
const { validateRequest } = require('../middleware/validate-request');
const { publicCache } = require('../utils/cache-control');
const productsController = require('../controllers/products.controller');
const productsValidator = require('../validators/products.validator');

const router = express.Router();

router.get(
  '/',
  publicCache(),
  validateRequest(productsValidator.listProducts),
  asyncHandler(productsController.list),
);

router.get(
  '/:slug',
  publicCache(),
  validateRequest(productsValidator.getProductBySlug),
  asyncHandler(productsController.getBySlug),
);

module.exports = router;
