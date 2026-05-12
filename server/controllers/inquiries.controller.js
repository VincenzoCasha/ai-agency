'use strict';

const inquiryService = require('../services/inquiry.service');

async function create(req, res) {
  const { id } = await inquiryService.create(req.body);
  res.status(201).json({ id, status: 'NEW' });
}

module.exports = { create };
