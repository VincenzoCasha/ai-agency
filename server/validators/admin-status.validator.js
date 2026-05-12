'use strict';

const { paginationRules } = require('./common.validator');

const idParam = { params: { id: { type: 'integer', required: true, min: 1 } } };

const pickupList = {
  query: {
    ...paginationRules,
    status: { type: 'string', required: false, enum: ['NEW', 'CONFIRMED', 'READY', 'PICKED_UP', 'CANCELLED'] },
    from_date: { type: 'string', required: false, pattern: /^\d{4}-\d{2}-\d{2}$/, minLength: 10, maxLength: 10 },
    to_date:   { type: 'string', required: false, pattern: /^\d{4}-\d{2}-\d{2}$/, minLength: 10, maxLength: 10 },
    q: { type: 'string', required: false, trim: true, maxLength: 100 },
  },
};

const pickupStatus = {
  params: idParam.params,
  body: {
    status: { type: 'string', required: true, enum: ['NEW', 'CONFIRMED', 'READY', 'PICKED_UP', 'CANCELLED'] },
  },
};

const inquiryList = {
  query: {
    ...paginationRules,
    status: { type: 'string', required: false, enum: ['NEW', 'IN_PROGRESS', 'DONE', 'SPAM'] },
    type:   { type: 'string', required: false, enum: ['CONTACT', 'WHOLESALE', 'PICKUP', 'EVENT'] },
    q: { type: 'string', required: false, trim: true, maxLength: 100 },
  },
};

const inquiryStatus = {
  params: idParam.params,
  body: {
    status: { type: 'string', required: true, enum: ['NEW', 'IN_PROGRESS', 'DONE', 'SPAM'] },
  },
};

const reservationList = {
  query: {
    ...paginationRules,
    event_id: { type: 'integer', required: false, min: 1 },
    status:   { type: 'string', required: false, enum: ['NEW', 'CONFIRMED', 'CANCELLED'] },
  },
};

const reservationStatus = {
  params: idParam.params,
  body: {
    status: { type: 'string', required: true, enum: ['NEW', 'CONFIRMED', 'CANCELLED'] },
  },
};

const kpis = {
  query: {
    period: { type: 'string', required: false, enum: ['today', '7d', '30d'], default: '7d' },
  },
};

module.exports = {
  idParam,
  pickupList,
  pickupStatus,
  inquiryList,
  inquiryStatus,
  reservationList,
  reservationStatus,
  kpis,
};
