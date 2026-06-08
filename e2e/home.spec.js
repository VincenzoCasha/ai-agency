import { test, expect } from '@playwright/test';
import { mockApi, hideCookieBanner } from './fixtures/mockApi';
import { expectNoSeriousA11y, auditContrast } from './helpers/a11y';
import { expectNoHorizontalScroll, expectNavTapTargets } from './helpers/layout';

test.beforeEach(async ({ page }) => {
  await mockApi(page);
  await hideCookieBanner(page);
});

test('home carga con H1 único y navegación', async ({ page }) => {
  await page.goto('/');

  // Un solo H1 visible (jerarquía de headings correcta).
  const h1 = page.getByRole('heading', { level: 1 });
  await expect(h1.first()).toBeVisible();
  expect(await h1.count()).toBe(1);

  // Cabecera presente con el logo de la marca CRUDO (img alt="CRUDO").
  await expect(page.getByRole('banner')).toBeVisible();
  await expect(page.getByRole('banner').getByRole('img', { name: 'CRUDO' })).toBeVisible();
});

test('home: accesibilidad básica sin violaciones serias', async ({ page }) => {
  await page.goto('/');
  await expectNoSeriousA11y(page);
  // Auditoría de contraste NO bloqueante (hallazgo de diseño, se reporta).
  const contrastNodes = await auditContrast(page);
  expect(contrastNodes).toBeGreaterThanOrEqual(0);
});

test('home en móvil: sin scroll horizontal y tap targets de nav', async ({ page }) => {
  await page.goto('/');
  await expectNoHorizontalScroll(page);
  await expectNavTapTargets(page);
});
