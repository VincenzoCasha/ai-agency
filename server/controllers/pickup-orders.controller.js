'use strict';

const { createProblem } = require('../utils/problem');
const pickupService = require('../services/pickup-order.service');
const idempotencyService = require('../services/idempotency.service');

const ITEM_QTY_MIN = 1;
const ITEM_QTY_MAX = 99;
const FORBIDDEN_PRICE_FIELDS = ['total_cents', 'unit_price_cents', 'price_cents', 'line_total_cents'];

function buildProblem({ status, title, detail, instance, code, extra = {}, type }) {
  const base = createProblem({
    status,
    title,
    detail,
    instance,
    extra: { ...(code ? { code } : {}), ...extra },
  });
  if (type) base.type = type;
  return base;
}

function rejectClientSuppliedPrices(body, instance) {
  const offenders = [];
  for (const f of FORBIDDEN_PRICE_FIELDS) {
    if (body[f] !== undefined) offenders.push(`body.${f}`);
  }
  if (Array.isArray(body.items)) {
    body.items.forEach((it, i) => {
      if (!it || typeof it !== 'object') return;
      for (const f of FORBIDDEN_PRICE_FIELDS) {
        if (it[f] !== undefined) offenders.push(`body.items[${i}].${f}`);
      }
    });
  }
  if (!offenders.length) return null;
  return buildProblem({
    status: 422,
    title: 'Unprocessable Entity',
    detail: 'El cliente no puede enviar precios. CRUDO calcula el total desde la base de datos.',
    instance,
    code: 'CLIENT_PRICES_NOT_ALLOWED',
    extra: { offenders },
  });
}

function validateItemShapes(items, instance) {
  const errors = [];
  items.forEach((it, i) => {
    if (!it || typeof it !== 'object') {
      errors.push({ field: `items[${i}]`, message: 'item debe ser un objeto' });
      return;
    }
    if (!Number.isInteger(it.qty) || it.qty < ITEM_QTY_MIN || it.qty > ITEM_QTY_MAX) {
      errors.push({ field: `items[${i}].qty`, message: `qty debe ser un entero entre ${ITEM_QTY_MIN} y ${ITEM_QTY_MAX}` });
    }
    const hasProductId = Number.isInteger(it.product_id) && it.product_id > 0;
    const hasProductSlug = typeof it.product_slug === 'string' && it.product_slug.length > 0;
    if (!hasProductId && !hasProductSlug) {
      errors.push({ field: `items[${i}]`, message: 'cada item necesita product_id o product_slug' });
    }
  });
  if (!errors.length) return null;
  return buildProblem({
    status: 400,
    title: 'Bad Request',
    detail: 'Algun item del carrito es invalido.',
    instance,
    extra: { errors },
  });
}

function errorToProblem(err, instance) {
  const status = err.status || 500;
  const code = err.extra?.code;
  return buildProblem({
    status,
    title: err.title || (status === 422 ? 'Unprocessable Entity' : status === 404 ? 'Not Found' : 'Error'),
    detail: err.detail || err.message,
    instance,
    code,
    extra: { ...(err.extra || {}) },
    type: err.problemType,
  });
}

async function create(req, res) {
  const instance = req.path;
  const idempotencyKey = (req.get('Idempotency-Key') || req.get('idempotency-key') || '').trim() || null;

  // 1. Defensa: cliente no puede enviar precios.
  const priceProblem = rejectClientSuppliedPrices(req.body, instance);
  if (priceProblem) {
    return res.status(422).type('application/problem+json').json(priceProblem);
  }

  // 2. Validacion fina de cada item (qty + identifier).
  const itemsProblem = validateItemShapes(req.body.items, instance);
  if (itemsProblem) {
    return res.status(400).type('application/problem+json').json(itemsProblem);
  }

  // 3. Idempotencia previa al servicio.
  const requestHash = idempotencyService.hashPayload(req.body);
  if (idempotencyKey) {
    const cached = await idempotencyService.lookup(idempotencyKey);
    if (cached) {
      if (cached.requestHash !== requestHash) {
        const problem = buildProblem({
          status: 409,
          title: 'Conflict',
          detail: 'Idempotency-Key ya usada con un payload diferente.',
          instance,
          code: 'IDEMPOTENCY_KEY_CONFLICT',
        });
        return res.status(409).type('application/problem+json').json(problem);
      }
      return res.status(cached.statusCode).json(cached.response);
    }
  }

  // 4. Crear pedido (puede lanzar PickupValidationError 404/422).
  let result;
  try {
    result = await pickupService.createPickupOrder(req.body);
  } catch (err) {
    if (err.status === 404 || err.status === 422) {
      const problem = errorToProblem(err, instance);
      return res.status(err.status).type('application/problem+json').json(problem);
    }
    throw err;
  }

  // 5. Persistir idempotencia tras commit exitoso.
  if (idempotencyKey) {
    try {
      await idempotencyService.persist({
        keyValue: idempotencyKey,
        requestHash,
        statusCode: 201,
        response: result,
        resourceType: 'pickup_order',
        resourceId: result.order_id,
      });
    } catch {
      // No rompemos la respuesta si la persistencia idempotente falla
      // (otro request paralelo pudo ya haberla guardado). El doble envio
      // estricto se gestionara en una iteracion futura con UNIQUE constraint
      // en otra columna.
    }
  }

  res.status(201).json(result);
}

module.exports = { create };
