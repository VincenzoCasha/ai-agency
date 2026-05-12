/**
 * Helper para tests de rutas: garantiza DB de test migrada+seedeada y
 * devuelve la app Express y supertest agent listos para ejercitar.
 *
 * Cada test file que use `prepareApp` resetea la DB de test al inicio para
 * que los tests sean independientes del orden de ejecucion.
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const supertest = require('supertest');
const app = require('../../server/app.js');

import { checkAvailability, resetTestDatabase, seedTestDatabase } from './db-test.js';

export async function prepareApp() {
  const availability = await checkAvailability();
  if (!availability.available) return { availability, request: null };
  await resetTestDatabase();
  await seedTestDatabase();
  return { availability, request: supertest(app) };
}

export function rawApp() {
  return app;
}

export { supertest };
