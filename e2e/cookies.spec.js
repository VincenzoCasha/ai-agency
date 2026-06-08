import { test, expect } from '@playwright/test';
import { mockApi } from './fixtures/mockApi';

test.beforeEach(async ({ page }) => {
  await mockApi(page);
});

test('cookie banner: aceptar lo oculta', async ({ page }) => {
  await page.goto('/');
  const accept = page.getByTestId('cookie-accept');
  await expect(accept).toBeVisible();
  await accept.click();
  await expect(page.getByTestId('cookie-accept')).toHaveCount(0);
});

test('cookie banner: rechazar lo oculta', async ({ page }) => {
  await page.goto('/');
  const reject = page.getByTestId('cookie-reject');
  await expect(reject).toBeVisible();
  await reject.click();
  await expect(page.getByTestId('cookie-reject')).toHaveCount(0);
});

test('cookie banner: configurar abre el panel y guardar persiste', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('cookie-configure').click();

  // El modal de preferencias (role=dialog) muestra las categorías.
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(dialog.getByText('Analiticas')).toBeVisible();
  await expect(dialog.getByText('Marketing')).toBeVisible();

  await page.getByTestId('cookie-save').click();
  // Tras guardar, el banner desaparece (hay decisión registrada).
  await expect(page.getByTestId('cookie-accept')).toHaveCount(0);
});

test('cookie banner: la decisión persiste tras recargar', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('cookie-accept').click();
  await page.reload();
  await expect(page.getByTestId('cookie-accept')).toHaveCount(0);
});
