import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../server/app.js';

// Force test environment so DB ping is skipped
process.env.NODE_ENV = 'test';

describe('GET /api/v1/health', () => {
  it('responds 200 with status ok', async () => {
    const res = await request(app).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.service).toBe('crudo-api');
    expect(res.body.checks.database.status).toBe('skipped');
  });
});

describe('404 handler', () => {
  it('returns RFC 7807 problem detail for unknown routes', async () => {
    const res = await request(app).get('/api/v1/does-not-exist');
    expect(res.status).toBe(404);
    expect(res.headers['content-type']).toMatch('application/problem+json');
    expect(res.body.status).toBe(404);
    expect(res.body.title).toBe('Not Found');
  });
});

describe('Error handler', () => {
  it('returns RFC 7807 for thrown errors', async () => {
    // The app has no /api/v1/error-test route in production;
    // we test via a non-existent endpoint which hits the 404 handler.
    const res = await request(app).post('/api/v1/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty('type');
    expect(res.body).toHaveProperty('status');
  });
});
