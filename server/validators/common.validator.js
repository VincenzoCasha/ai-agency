'use strict';

const slugRule = {
  type: 'string',
  required: true,
  trim: true,
  minLength: 1,
  maxLength: 160,
  pattern: /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
};

const paginationRules = {
  page: { type: 'integer', required: false, min: 1, default: 1 },
  size: { type: 'integer', required: false, min: 1, max: 50, default: 20 },
};

module.exports = { slugRule, paginationRules };
