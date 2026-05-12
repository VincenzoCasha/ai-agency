'use strict';

const express = require('express');
const { asyncHandler } = require('../middleware/async-handler');
const { validateRequest } = require('../middleware/validate-request');
const { publicCache } = require('../utils/cache-control');
const categoriesController = require('../controllers/categories.controller');
const productsValidator = require('../validators/products.validator');

const router = express.Router();

router.get(
  '/',
  publicCache(),
  validateRequest(productsValidator.listCategories),
  asyncHandler(categoriesController.list),
);

module.exports = router;
