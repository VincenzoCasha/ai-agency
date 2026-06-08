import { test, expect } from '@playwright/test';
import { mockApi, hideCookieBanner } from './fixtures/mockApi';
import { expectNoSeriousA11y } from './helpers/a11y';

test.beforeEach(async ({ page }) => {
  await mockApi(page);
  await hideCookieBanner(page);
});

test('/eventos lista eventos y enlaza al detalle', async ({ page }) => {
  await page.goto('/eventos');
  const eventLink = page.getByRole('link', { name: /Cata Telperion/i }).first();
  await expect(eventLink).toBeVisible();
  await eventLink.click();
  await expect(page).toHaveURL(/\/eventos\/cata-telperion/);
  await expect(page.getByRole('heading', { name: /Cata Telperion/i })).toBeVisible();
});

test('detalle de evento: solicitar reserva envía la solicitud', async ({ page }) => {
  await page.goto('/eventos/cata-telperion');

  await page.getByLabel('Nombre').fill('Ana Tester');
  await page.getByLabel('Email').fill('ana@example.com');
  await page.getByLabel('Teléfono').fill('+34600111222');

  // El POST de reserva está mockeado a 201 — esperamos esa respuesta como
  // señal de éxito (el formulario no navega a otra ruta).
  const [resp] = await Promise.all([
    page.waitForResponse((r) => /\/events\/.+\/reservations$/.test(r.url()) && r.request().method() === 'POST'),
    page.getByRole('button', { name: /Solicitar reserva/i }).click(),
  ]);
  expect(resp.status()).toBe(201);
});

test('/eventos: accesibilidad básica sin violaciones serias', async ({ page }) => {
  await page.goto('/eventos');
  await expectNoSeriousA11y(page);
});
