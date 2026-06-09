import { test, expect } from '@playwright/test';
import { mockApi, hideCookieBanner } from './fixtures/mockApi';
import { expectNoSeriousA11y } from './helpers/a11y';
import { expectNoHorizontalScroll } from './helpers/layout';

test.beforeEach(async ({ page }) => {
  await mockApi(page);
  await hideCookieBanner(page);
});

test('/seleccion carga y lista productos', async ({ page }) => {
  await page.goto('/seleccion');
  await expect(page.getByRole('heading', { level: 1, name: /Lo que tenemos esta semana/i })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Manchego curado' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Rioja Reserva' })).toBeVisible();
});

test('alcohol guard (frontend): el queso permite Añadir a Mi Cesta', async ({ page }) => {
  await page.goto('/seleccion');
  await expect(
    page.getByRole('button', { name: /Añadir Manchego curado a Mi Cesta/i }),
  ).toBeVisible();
});

test('alcohol guard (frontend): el vino solo ofrece WhatsApp, nunca Añadir', async ({ page }) => {
  await page.goto('/seleccion');

  // CTA de WhatsApp con enlace wa.me y el nombre del vino.
  const waLink = page.getByRole('link', { name: /Consultar Rioja Reserva por WhatsApp/i });
  await expect(waLink).toBeVisible();
  const href = await waLink.getAttribute('href');
  expect(href).toMatch(/wa\.me\//);

  // NUNCA debe existir un botón "Añadir" para el vino.
  await expect(
    page.getByRole('button', { name: /Añadir Rioja Reserva a Mi Cesta/i }),
  ).toHaveCount(0);
});

test('producto agotado: el botón Añadir está deshabilitado', async ({ page }) => {
  await page.goto('/seleccion');
  await expect(
    page.getByRole('button', { name: /Añadir Azul de Valdeón a Mi Cesta/i }),
  ).toBeDisabled();
});

test('/seleccion: accesibilidad básica y sin scroll horizontal', async ({ page }) => {
  await page.goto('/seleccion');
  await expectNoSeriousA11y(page);
  await expectNoHorizontalScroll(page);
});
