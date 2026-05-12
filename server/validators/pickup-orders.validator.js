'use strict';

/**
 * Pickup orders validator.
 *
 * El validador centralizado solo cubre el envoltorio del payload (campos top
 * level + tipos). La validacion fina de cada `item` (al menos product_id o
 * product_slug, qty 1-99, alcohol guard, fecha/slot reales) se realiza en
 * `pickup-order.service.js`, donde tenemos acceso a la DB y podemos devolver
 * `invalid_items` con detalles consistentes.
 */

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

const create = {
  body: {
    name:        { type: 'string',  required: true,  trim: true, minLength: 2,  maxLength: 120 },
    email:       { type: 'email',   required: true,  trim: true, maxLength: 160 },
    phone:       { type: 'string',  required: true,  trim: true, minLength: 6,  maxLength: 30 },
    pickup_date: { type: 'string',  required: true,  trim: true, pattern: ISO_DATE, minLength: 10, maxLength: 10 },
    pickup_slot: { type: 'string',  required: true,  trim: true, minLength: 5,  maxLength: 5 },
    notes:       { type: 'string',  required: false, trim: true, maxLength: 1000 },
    items:       { type: 'array',   required: true,  min: 1, max: 30 },
  },
};

module.exports = { create };
