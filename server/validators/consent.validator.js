'use strict';

const record = {
  body: {
    consent_id:  { type: 'string',  required: true, trim: true, minLength: 6, maxLength: 64 },
    analytics:   { type: 'boolean', required: true },
    marketing:   { type: 'boolean', required: true },
    preferences: { type: 'boolean', required: true },
  },
};

module.exports = { record };
