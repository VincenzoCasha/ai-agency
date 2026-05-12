'use strict';

const { slugRule } = require('./common.validator');

const eventSlugParam = { params: { slug: slugRule } };

const createReservation = {
  params: { slug: slugRule },
  body: {
    name:       { type: 'string',  required: true, trim: true, minLength: 2, maxLength: 200 },
    email:      { type: 'email',   required: true, trim: true, maxLength: 255 },
    phone:      { type: 'string',  required: true, trim: true, minLength: 6, maxLength: 40 },
    party_size: { type: 'integer', required: true, min: 1, max: 4 },
    notes:      { type: 'string',  required: false, trim: true, maxLength: 1000 },
  },
};

module.exports = { eventSlugParam, createReservation };
