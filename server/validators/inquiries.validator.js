'use strict';

const create = {
  body: {
    type:    { type: 'string',  required: true, enum: ['CONTACT', 'WHOLESALE', 'EVENT'] },
    name:    { type: 'string',  required: true, trim: true, minLength: 2, maxLength: 200 },
    email:   { type: 'email',   required: true, trim: true, maxLength: 255 },
    phone:   { type: 'string',  required: false, trim: true, maxLength: 40 },
    message: { type: 'string',  required: true, trim: true, minLength: 5, maxLength: 4000 },
    payload: { type: 'object',  required: false },
  },
};

module.exports = { create };
