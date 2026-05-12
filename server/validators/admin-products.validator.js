'use strict';

const { slugRule, paginationRules } = require('./common.validator');

const PRODUCT_TYPE = ['CHEESE', 'WINE', 'TABLA', 'OTHER'];
const STOCK_STATUS = ['IN_STOCK', 'LOW', 'OUT'];
const MILK_TYPE = ['COW', 'SHEEP', 'GOAT', 'MIXED'];
const MILK_TREATMENT = ['RAW', 'PASTEURIZED', 'THERMIZED'];
const INTENSITY = ['MILD', 'MEDIUM', 'STRONG'];

const list = {
  query: {
    ...paginationRules,
    type: { type: 'string', required: false, enum: PRODUCT_TYPE },
    is_active: { type: 'boolean', required: false },
    stock_status: { type: 'string', required: false, enum: STOCK_STATUS },
    q: { type: 'string', required: false, trim: true, maxLength: 100 },
  },
};

const create = {
  body: {
    slug:           { ...slugRule },
    name:           { type: 'string', required: true,  trim: true, minLength: 2, maxLength: 200 },
    type:           { type: 'string', required: true,  enum: PRODUCT_TYPE },
    is_alcohol:     { type: 'boolean', required: false },
    price_cents:    { type: 'integer', required: true,  min: 0, max: 1000000 },
    vat_rate:       { type: 'number', required: false, min: 0, max: 100 },
    short_desc:     { type: 'string', required: false, trim: true, maxLength: 500 },
    long_desc:      { type: 'string', required: false, trim: true, maxLength: 8000 },
    producer:       { type: 'string', required: false, trim: true, maxLength: 200 },
    region:         { type: 'string', required: false, trim: true, maxLength: 160 },
    milk_type:      { type: 'string', required: false, enum: MILK_TYPE },
    milk_treatment: { type: 'string', required: false, enum: MILK_TREATMENT },
    intensity:      { type: 'string', required: false, enum: INTENSITY },
    pairing_notes:  { type: 'string', required: false, trim: true, maxLength: 4000 },
    is_seasonal:    { type: 'boolean', required: false },
    is_featured:    { type: 'boolean', required: false },
    is_active:      { type: 'boolean', required: false },
    stock_status:   { type: 'string',  required: false, enum: STOCK_STATUS },
  },
};

const idParam = {
  params: { id: { type: 'integer', required: true, min: 1 } },
};

const update = {
  params: idParam.params,
  body: {
    slug:           { ...slugRule, required: false },
    name:           { type: 'string',  required: false, trim: true, minLength: 2, maxLength: 200 },
    type:           { type: 'string',  required: false, enum: PRODUCT_TYPE },
    is_alcohol:     { type: 'boolean', required: false },
    price_cents:    { type: 'integer', required: false, min: 0, max: 1000000 },
    vat_rate:       { type: 'number',  required: false, min: 0, max: 100 },
    short_desc:     { type: 'string',  required: false, trim: true, maxLength: 500 },
    long_desc:      { type: 'string',  required: false, trim: true, maxLength: 8000 },
    producer:       { type: 'string',  required: false, trim: true, maxLength: 200 },
    region:         { type: 'string',  required: false, trim: true, maxLength: 160 },
    milk_type:      { type: 'string',  required: false, enum: MILK_TYPE },
    milk_treatment: { type: 'string',  required: false, enum: MILK_TREATMENT },
    intensity:      { type: 'string',  required: false, enum: INTENSITY },
    pairing_notes:  { type: 'string',  required: false, trim: true, maxLength: 4000 },
    is_seasonal:    { type: 'boolean', required: false },
    is_featured:    { type: 'boolean', required: false },
    is_active:      { type: 'boolean', required: false },
    stock_status:   { type: 'string',  required: false, enum: STOCK_STATUS },
  },
};

const stockUpdate = {
  params: idParam.params,
  body: {
    stock_status: { type: 'string', required: true, enum: STOCK_STATUS },
  },
};

module.exports = {
  list,
  create,
  update,
  stockUpdate,
  idParam,
  PRODUCT_TYPE,
  STOCK_STATUS,
};
