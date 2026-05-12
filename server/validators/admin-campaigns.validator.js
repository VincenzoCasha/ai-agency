'use strict';

const { slugRule, paginationRules } = require('./common.validator');

const list = {
  query: {
    ...paginationRules,
    is_active: { type: 'boolean', required: false },
    q: { type: 'string', required: false, trim: true, maxLength: 100 },
  },
};

const create = {
  body: {
    slug:           { ...slugRule },
    title:          { type: 'string',  required: true,  trim: true, minLength: 2, maxLength: 200 },
    subtitle:       { type: 'string',  required: false, trim: true, maxLength: 300 },
    hero_image_url: { type: 'string',  required: false, trim: true, maxLength: 500 },
    body_md:        { type: 'string',  required: false, trim: true, maxLength: 16000 },
    starts_at:      { type: 'string',  required: false, maxLength: 50 },
    ends_at:        { type: 'string',  required: false, maxLength: 50 },
    is_active:      { type: 'boolean', required: false },
    product_ids:    { type: 'array',   required: false, max: 100 },
  },
};

const idParam = { params: { id: { type: 'integer', required: true, min: 1 } } };

const update = {
  params: idParam.params,
  body: {
    slug:           { ...slugRule, required: false },
    title:          { type: 'string',  required: false, trim: true, minLength: 2, maxLength: 200 },
    subtitle:       { type: 'string',  required: false, trim: true, maxLength: 300 },
    hero_image_url: { type: 'string',  required: false, trim: true, maxLength: 500 },
    body_md:        { type: 'string',  required: false, trim: true, maxLength: 16000 },
    starts_at:      { type: 'string',  required: false, maxLength: 50 },
    ends_at:        { type: 'string',  required: false, maxLength: 50 },
    is_active:      { type: 'boolean', required: false },
    product_ids:    { type: 'array',   required: false, max: 100 },
  },
};

module.exports = { list, create, update, idParam };
