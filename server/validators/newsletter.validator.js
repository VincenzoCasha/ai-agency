'use strict';

const subscribe = {
  body: {
    email:   { type: 'email',   required: true, trim: true, maxLength: 255 },
    source:  { type: 'string',  required: false, trim: true, maxLength: 80 },
    consent: { type: 'boolean', required: false },
  },
};

module.exports = { subscribe };
