/**
 * Helper para tests admin: logea con la credencial dev seedeada y devuelve un
 * supertest agent con `Authorization: Bearer <token>` ya seteado.
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const supertest = require('supertest');
const app = require('../../server/app.js');

import { prepareApp } from './app-test.js';

export const SEED_ADMIN_EMAIL = 'admin.local@example.test';
export const SEED_ADMIN_PASSWORD = 'change-me-local-only';

export async function prepareAdmin() {
  const { availability } = await prepareApp();
  if (!availability.available) return { availability, request: null, tokens: null };

  const request = supertest(app);
  const res = await request.post('/api/v1/admin/auth/login').send({
    email: SEED_ADMIN_EMAIL,
    password: SEED_ADMIN_PASSWORD,
  });
  if (res.status !== 200) {
    throw new Error(`Admin login fallo en setup: ${res.status} ${JSON.stringify(res.body)}`);
  }
  return {
    availability,
    request,
    tokens: res.body,
    auth: (req) => req.set('Authorization', `Bearer ${res.body.access_token}`),
  };
}
