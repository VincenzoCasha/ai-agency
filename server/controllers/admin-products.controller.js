'use strict';

const service = require('../services/admin-product.service');

async function list(req, res) {
  const result = await service.paginate({
    page: req.query.page,
    size: req.query.size,
    type: req.query.type,
    isActive: req.query.is_active,
    stockStatus: req.query.stock_status,
    q: req.query.q,
  });
  res.json(result);
}

async function get(req, res) {
  const product = await service.getById(req.params.id);
  res.json(product);
}

async function create(req, res) {
  const product = await service.create(req.admin.id, req.body);
  res.status(201).json(product);
}

async function update(req, res) {
  const product = await service.update(req.admin.id, req.params.id, req.body);
  res.json(product);
}

async function patchStock(req, res) {
  const product = await service.setStock(req.admin.id, req.params.id, req.body.stock_status);
  res.json(product);
}

async function softDelete(req, res) {
  const result = await service.softDelete(req.admin.id, req.params.id);
  res.json(result);
}

async function uploadImage(req, res) {
  if (!req.file) {
    const err = new Error('No se recibio ningun archivo image.');
    err.status = 400;
    err.title = 'Bad Request';
    err.extra = { code: 'IMAGE_FILE_REQUIRED' };
    throw err;
  }
  const image = await service.addImage(req.admin.id, req.params.id, {
    file: req.file,
    altText: req.body?.alt_text,
    isPrimary: req.body?.is_primary === 'true' || req.body?.is_primary === true,
    sortOrder: req.body?.sort_order,
  });
  res.status(201).json(image);
}

async function deleteImage(req, res) {
  const result = await service.deleteImage(req.admin.id, req.params.id, req.params.image_id);
  res.json(result);
}

module.exports = { list, get, create, update, patchStock, softDelete, uploadImage, deleteImage };
