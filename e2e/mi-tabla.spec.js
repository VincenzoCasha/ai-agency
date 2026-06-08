import { test, expect } from '@playwright/test';
import { mockApi, hideCookieBanner } from './fixtures/mockApi';
import { expectNoSeriousA11y } from './helpers/a11y';

test.beforeEach(async ({ page }) => {
  await mockApi(page);
  await hideCookieBanner(page);
});

function isoDaysAhead(days) {
  const d = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

test('flujo completo: añadir queso → Mi Tabla → pickup → confirmación', async ({ page }) => {
  // 1. Añadir un queso desde la selección.
  await page.goto('/seleccion');
  await page.getByRole('button', { name: /Añadir Manchego curado a Mi Tabla/i }).click();

  // 2. Ir a Mi Tabla; el borrador persiste en localStorage.
  await page.goto('/mi-tabla');
  await expect(page.getByRole('heading', { name: /Tu tabla \(1\)/i })).toBeVisible();
  await expect(page.getByText('Manchego curado')).toBeVisible();

  // 3. Rellenar el formulario de recogida.
  await page.getByLabel('Nombre').fill('Ana Tester');
  await page.getByLabel('Email').fill('ana@example.com');
  await page.getByLabel('Teléfono').fill('+34600111222');
  await page.getByLabel('Día de recogida').fill(isoDaysAhead(3));
  await page.getByLabel('Hora').selectOption('12:00');

  // 4. Enviar → confirmación (POST /pickup-orders mockeado a 201).
  await page.getByRole('button', { name: /Reservar para recoger/i }).click();
  await expect(page).toHaveURL(/\/mi-tabla\/confirmacion/);
});

test('Mi Tabla vacía: invita a añadir queso y no permite reservar', async ({ page }) => {
  await page.goto('/mi-tabla');
  await expect(page.getByRole('heading', { name: /Tu tabla \(0\)/i })).toBeVisible();
  await expect(page.getByText(/Añade algún queso a la tabla/i)).toBeVisible();
  // Sin items no se renderiza el formulario de pickup.
  await expect(page.getByRole('button', { name: /Reservar para recoger/i })).toHaveCount(0);
});

test('/mi-tabla: accesibilidad básica sin violaciones serias', async ({ page }) => {
  await page.goto('/mi-tabla');
  await expectNoSeriousA11y(page);
});
