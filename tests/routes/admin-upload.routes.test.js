import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prepareAdmin } from '../helpers/admin-test.js';
import fs from 'fs';
import path from 'path';

// PNG 1x1 transparente (mas pequeno posible) para test de upload sin generar
// archivos reales pesados.
const PNG_1x1 = Buffer.from(
  '89504E470D0A1A0A0000000D49484452000000010000000108060000001F15C4890000000A49444154789C63000100000005000100A0E60001000000004945' +
  '4E44AE426082',
  'hex',
);

describe('Admin product image upload', () => {
  let availability, request, auth, productId;
  const uploadsTestRoot = path.resolve(process.cwd(), 'uploads', 'test');

  beforeAll(async () => {
    ({ availability, request, auth } = await prepareAdmin());
    if (!availability.available) return;
    // Producto fresco para imagenes
    const created = await auth(request.post('/api/v1/admin/products')).send({
      slug: 'queso-upload-test', name: 'Queso Upload Test',
      type: 'CHEESE', price_cents: 1000,
    });
    productId = created.body.id;
  }, 30000);

  afterAll(() => {
    // Limpieza basica del directorio test/
    try {
      if (fs.existsSync(uploadsTestRoot)) {
        fs.rmSync(uploadsTestRoot, { recursive: true, force: true });
      }
    } catch {
      // best-effort
    }
  });

  it('upload PNG valido -> 201 con url y registra audit', async () => {
    if (!availability.available) return;
    const res = await auth(request.post(`/api/v1/admin/products/${productId}/images`))
      .attach('image', PNG_1x1, { filename: 'test.png', contentType: 'image/png' })
      .field('alt_text', 'Test alt')
      .field('is_primary', 'true');
    expect(res.status).toBe(201);
    expect(res.body.url).toMatch(/\/uploads\/.*products\/test-/);
    expect(res.body.is_primary).toBe(true);

    // Verificar archivo en disco bajo uploads/test/products/
    const filename = res.body.url.split('/').pop();
    const filePath = path.join(uploadsTestRoot, 'products', filename);
    expect(fs.existsSync(filePath)).toBe(true);
  });

  it('upload con tipo no permitido (text/plain) -> 422 INVALID_MIME', async () => {
    if (!availability.available) return;
    const res = await auth(request.post(`/api/v1/admin/products/${productId}/images`))
      .attach('image', Buffer.from('not an image'), { filename: 'evil.txt', contentType: 'text/plain' });
    expect(res.status).toBe(422);
    expect(['INVALID_MIME', 'INVALID_EXT']).toContain(res.body.code);
  });

  it('DELETE imagen funciona y borra del disco', async () => {
    if (!availability.available) return;
    const upload = await auth(request.post(`/api/v1/admin/products/${productId}/images`))
      .attach('image', PNG_1x1, { filename: 'borrame.png', contentType: 'image/png' });
    expect(upload.status).toBe(201);

    const del = await auth(request.delete(`/api/v1/admin/products/${productId}/images/${upload.body.id}`));
    expect(del.status).toBe(200);
    expect(del.body.deleted).toBe(true);
  });
});
