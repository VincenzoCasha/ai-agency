'use strict';

const { slugRule, paginationRules } = require('./common.validator');

const listProducts = {
  query: {
    ...paginationRules,
    type: { type: 'string', required: false, enum: ['CHEESE', 'WINE', 'TABLA', 'OTHER'] },
    category: { type: 'string', required: false, trim: true, maxLength: 160 },
    seasonal: { type: 'boolean', required: false },
    featured: { type: 'boolean', required: false },
    is_alcohol: { type: 'boolean', required: false },
    q: { type: 'string', required: false, trim: true, maxLength: 100 },
  },
};

const getProductBySlug = {
  params: { slug: slugRule },
};

const listCategories = {
  query: {
    type: { type: 'string', required: false, enum: ['CHEESE', 'WINE', 'TABLA', 'OTHER'] },
  },
};

module.exports = { listProducts, getProductBySlug, listCategories };
