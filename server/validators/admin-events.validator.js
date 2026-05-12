'use strict';

const { slugRule, paginationRules } = require('./common.validator');

const ISO_DATETIME = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2})?(\.\d+)?(Z|[+-]\d{2}:?\d{2})?$/;

const list = {
  query: {
    ...paginationRules,
    is_active: { type: 'boolean', required: false },
    include_past: { type: 'boolean', required: false },
    q: { type: 'string', required: false, trim: true, maxLength: 100 },
  },
};

const create = {
  body: {
    slug:           { ...slugRule },
    title:          { type: 'string',  required: true,  trim: true, minLength: 2, maxLength: 200 },
    description_md: { type: 'string',  required: false, trim: true, maxLength: 8000 },
    hero_image_url: { type: 'string',  required: false, trim: true, maxLength: 500 },
    starts_at:      { type: 'string',  required: true,  pattern: ISO_DATETIME, maxLength: 50 },
    ends_at:        { type: 'string',  required: false, pattern: ISO_DATETIME, maxLength: 50 },
    capacity:       { type: 'integer', required: true,  min: 0, max: 1000 },
    price_cents:    { type: 'integer', required: true,  min: 0, max: 1000000 },
    location:       { type: 'string',  required: false, trim: true, maxLength: 200 },
    is_active:      { type: 'boolean', required: false },
  },
};

const idParam = {
  params: { id: { type: 'integer', required: true, min: 1 } },
};

const update = {
  params: idParam.params,
  body: {
    slug:           { ...slugRule, required: false },
    title:          { type: 'string',  required: false, trim: true, minLength: 2, maxLength: 200 },
    description_md: { type: 'string',  required: false, trim: true, maxLength: 8000 },
    hero_image_url: { type: 'string',  required: false, trim: true, maxLength: 500 },
    starts_at:      { type: 'string',  required: false, pattern: ISO_DATETIME, maxLength: 50 },
    ends_at:        { type: 'string',  required: false, pattern: ISO_DATETIME, maxLength: 50 },
    capacity:       { type: 'integer', required: false, min: 0, max: 1000 },
    price_cents:    { type: 'integer', required: false, min: 0, max: 1000000 },
    location:       { type: 'string',  required: false, trim: true, maxLength: 200 },
    is_active:      { type: 'boolean', required: false },
  },
};

module.exports = { list, create, update, idParam };
