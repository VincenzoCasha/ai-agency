'use strict';

const update = {
  body: {
    pickup_paused:          { type: 'boolean', required: false },
    pickup_daily_capacity:  { type: 'integer', required: false, min: 0, max: 200 },
    pickup_open_message:    { type: 'string',  required: false, trim: true, maxLength: 500 },
  },
};

module.exports = { update };
