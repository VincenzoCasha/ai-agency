'use strict';

const inquiryRepo = require('../repositories/inquiry.repository');
const notification = require('./notification.service');

const PUBLIC_TYPES = ['CONTACT', 'WHOLESALE', 'EVENT'];

async function create(payload) {
  if (!PUBLIC_TYPES.includes(payload.type)) {
    const err = new Error(`Tipo de consulta no permitido en publico: ${payload.type}`);
    err.status = 422;
    err.detail = 'Tipo de inquiry no admitido por la API publica.';
    err.extra = { allowed: PUBLIC_TYPES };
    throw err;
  }

  const id = await inquiryRepo.create({
    type: payload.type,
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    message: payload.message,
    payload: payload.payload,
  });

  await notification.notifyNewInquiry({ id, type: payload.type, name: payload.name, email: payload.email });
  return { id };
}

module.exports = { create, PUBLIC_TYPES };
