'use strict';

const catalogService = require('../services/catalog.service');
const { createProblem } = require('../utils/problem');

async function list(req, res) {
  const { page, size, type, category, seasonal, featured, q, is_alcohol } = req.query;
  const filters = {};
  if (type) filters.type = type;
  if (category) filters.categorySlug = category;
  if (typeof seasonal === 'boolean') filters.isSeasonal = seasonal;
  if (typeof featured === 'boolean') filters.isFeatured = featured;
  if (typeof is_alcohol === 'boolean') filters.isAlcohol = is_alcohol;
  if (q) filters.q = q;

  const result = await catalogService.paginateProducts(filters, { page, size });
  res.json(result);
}

async function getBySlug(req, res) {
  const detail = await catalogService.getActiveProductDetail(req.params.slug);
  if (!detail) {
    return res.status(404).type('application/problem+json').json(
      createProblem({
        status: 404,
        title: 'Not Found',
        detail: 'Producto no encontrado.',
        instance: req.path,
      }),
    );
  }
  res.json(detail);
}

module.exports = { list, getBySlug };
