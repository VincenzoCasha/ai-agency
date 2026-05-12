'use strict';

/**
 * Centralized request validation middleware.
 *
 * Schema shape:
 *   {
 *     body:   { fieldName: rule },
 *     query:  { fieldName: rule },
 *     params: { fieldName: rule },
 *   }
 *
 * Or legacy shape (treated as body fields):
 *   { fieldName: rule }
 *
 * Rule keys:
 *   - required: boolean
 *   - type: 'string' | 'integer' | 'number' | 'boolean' | 'email' | 'enum' | 'array' | 'object'
 *   - enum: array of allowed values
 *   - min, max: numeric bounds (number/integer) or length bounds (string/array)
 *   - minLength, maxLength: explicit length bounds
 *   - pattern: RegExp
 *   - trim: boolean (string only)
 *   - default: value applied when undefined/null/empty
 *   - coerce: boolean (default true for query/params)
 */

const { createProblem } = require('../utils/problem');

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v);
}

function coerceValue(value, type) {
  if (value === undefined || value === null || value === '') return value;
  if (type === 'integer' || type === 'number') {
    const n = Number(value);
    return Number.isFinite(n) ? n : value;
  }
  if (type === 'boolean') {
    if (value === true || value === 'true' || value === '1' || value === 1) return true;
    if (value === false || value === 'false' || value === '0' || value === 0) return false;
    return value;
  }
  return value;
}

function checkRule(field, rawValue, rule, errors, location, opts) {
  let value = rawValue;

  const shouldCoerce = rule.coerce !== false && (opts.coerceByDefault || rule.coerce === true);
  if (shouldCoerce && rule.type) {
    value = coerceValue(value, rule.type);
  }

  if (typeof value === 'string' && rule.trim) {
    value = value.trim();
  }

  const isMissing = value === undefined || value === null || value === '';
  if (isMissing) {
    if (rule.required) {
      errors.push({ field, location, message: `${field} es obligatorio` });
    }
    return value;
  }

  switch (rule.type) {
    case 'string':
      if (typeof value !== 'string') {
        errors.push({ field, location, message: `${field} debe ser texto` });
        return value;
      }
      break;
    case 'integer':
      if (!Number.isInteger(value)) {
        errors.push({ field, location, message: `${field} debe ser un entero` });
        return value;
      }
      break;
    case 'number':
      if (typeof value !== 'number' || !Number.isFinite(value)) {
        errors.push({ field, location, message: `${field} debe ser un numero` });
        return value;
      }
      break;
    case 'boolean':
      if (typeof value !== 'boolean') {
        errors.push({ field, location, message: `${field} debe ser booleano` });
        return value;
      }
      break;
    case 'email':
      if (typeof value !== 'string' || !EMAIL_RE.test(value)) {
        errors.push({ field, location, message: `${field} debe ser un email valido` });
        return value;
      }
      break;
    case 'array':
      if (!Array.isArray(value)) {
        errors.push({ field, location, message: `${field} debe ser un array` });
        return value;
      }
      break;
    case 'object':
      if (!isPlainObject(value)) {
        errors.push({ field, location, message: `${field} debe ser un objeto` });
        return value;
      }
      break;
    default:
      break;
  }

  if (rule.enum && !rule.enum.includes(value)) {
    errors.push({ field, location, message: `${field} debe ser uno de: ${rule.enum.join(', ')}` });
  }

  if (typeof value === 'string') {
    const minL = rule.minLength !== undefined ? rule.minLength : rule.min;
    const maxL = rule.maxLength !== undefined ? rule.maxLength : rule.max;
    if (typeof minL === 'number' && value.length < minL) {
      errors.push({ field, location, message: `${field} debe tener al menos ${minL} caracteres` });
    }
    if (typeof maxL === 'number' && value.length > maxL) {
      errors.push({ field, location, message: `${field} no puede superar ${maxL} caracteres` });
    }
  }

  if (typeof value === 'number') {
    if (typeof rule.min === 'number' && value < rule.min) {
      errors.push({ field, location, message: `${field} debe ser >= ${rule.min}` });
    }
    if (typeof rule.max === 'number' && value > rule.max) {
      errors.push({ field, location, message: `${field} debe ser <= ${rule.max}` });
    }
  }

  if (Array.isArray(value)) {
    if (typeof rule.min === 'number' && value.length < rule.min) {
      errors.push({ field, location, message: `${field} debe tener al menos ${rule.min} elementos` });
    }
    if (typeof rule.max === 'number' && value.length > rule.max) {
      errors.push({ field, location, message: `${field} no puede tener mas de ${rule.max} elementos` });
    }
  }

  if (rule.pattern instanceof RegExp && typeof value === 'string' && !rule.pattern.test(value)) {
    errors.push({ field, location, message: `${field} no cumple el formato esperado` });
  }

  return value;
}

function normalizeSchema(schema) {
  if (schema && (schema.body || schema.query || schema.params)) return schema;
  return { body: schema || {} };
}

function validateRequest(rawSchema) {
  const schema = normalizeSchema(rawSchema);

  return (req, res, next) => {
    const errors = [];

    for (const location of ['body', 'query', 'params']) {
      const rules = schema[location];
      if (!rules) continue;

      if (!req[location]) req[location] = {};

      const coerceByDefault = location !== 'body';
      for (const [field, rule] of Object.entries(rules)) {
        const current = req[location][field];

        if (
          (current === undefined || current === null || current === '') &&
          rule.default !== undefined
        ) {
          req[location][field] = rule.default;
        }

        const value = checkRule(field, req[location][field], rule, errors, location, { coerceByDefault });

        if (value !== undefined) {
          req[location][field] = value;
        }
      }
    }

    if (errors.length) {
      const problem = createProblem({
        status: 400,
        title: 'Bad Request',
        detail: 'La peticion contiene campos invalidos.',
        instance: req.path,
        extra: { errors },
      });
      return res.status(400).type('application/problem+json').json(problem);
    }

    next();
  };
}

module.exports = { validateRequest };
