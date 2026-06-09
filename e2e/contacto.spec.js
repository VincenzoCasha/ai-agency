import { test, expect } from '@playwright/test';
import { mockApi, hideCookieBanner } from './fixtures/mockApi';
import { expectNoSeriousA11y } from './helpers/a11y';
import { expectNoHorizontalScroll } from './helpers/layout';

test.beforeEach(async ({ page }) => {
  await mockApi(page);
  await hideCookieBanner(page);
});

test('formulario de contacto: envío correcto muestra confirmación', async ({ page }) => {
  await page.goto('/contacto');

  await page.getByLabel('Nombre').fill('Ana Tester');
  await page.getByLabel('Email').fill('ana@example.com');
  await page.getByLabel('Mensaje').fill('Hola, me interesa una tabla para un evento.');

  await page.getByRole('button', { name: /Enviar consulta/i }).click();
  await expect(page.getByText(/Gracias por escribirnos/i)).toBeVisible();
});

test('/contacto: accesibilidad básica y sin scroll horizontal', async ({ page }) => {
  await page.goto('/contacto');
  await expectNoSeriousA11y(page);
  await expectNoHorizontalScroll(page);
});
