import { test, expect } from '@playwright/test';
import { mockApi, hideCookieBanner } from './fixtures/mockApi';
import { expectNoSeriousA11y } from './helpers/a11y';

test.beforeEach(async ({ page }) => {
  await mockApi(page);
  await hideCookieBanner(page);
});

const LEGAL_ROUTES = [
  { path: '/aviso-legal', name: 'aviso legal' },
  { path: '/privacidad', name: 'privacidad' },
  { path: '/cookies', name: 'cookies' },
];

for (const route of LEGAL_ROUTES) {
  test(`ruta legal ${route.name} renderiza con H1`, async ({ page }) => {
    await page.goto(route.path);
    await expect(page.getByRole('heading', { level: 1 }).first()).toBeVisible();
  });
}

test('aviso legal incluye datos del titular', async ({ page }) => {
  await page.goto('/aviso-legal');
  // Datos confirmados del titular (Fase 8). Se acota a <main> porque el nombre
  // legal también aparece en el footer.
  const main = page.getByRole('main');
  await expect(main.getByText(/CRUDO QUESOS/i).first()).toBeVisible();
  await expect(main.getByText(/B-19953694/i)).toBeVisible();
});

test('/cookies: accesibilidad básica sin violaciones serias', async ({ page }) => {
  await page.goto('/cookies');
  await expectNoSeriousA11y(page);
});
