import { test, expect } from '@playwright/test';
import { mockApi, hideCookieBanner } from './fixtures/mockApi';

test.beforeEach(async ({ page }) => {
  await mockApi(page);
  await hideCookieBanner(page);
});

test('/admin muestra el formulario de login', async ({ page }) => {
  await page.goto('/admin');
  await expect(page.getByLabel('Email')).toBeVisible();
  await expect(page.getByLabel('Contraseña')).toBeVisible();
  await expect(page.getByRole('button', { name: /Entrar/i })).toBeVisible();
});

test('login admin correcto entra al panel (Fase 7)', async ({ page }) => {
  await page.goto('/admin');

  await page.getByLabel('Email').fill('owner@crudomov.es');
  await page.getByLabel('Contraseña').fill('cualquier-cosa');
  await page.getByRole('button', { name: /Entrar/i }).click();

  // Tras el login mockeado, el dashboard renderiza su saludo.
  await expect(page.getByRole('heading', { name: /Hoy en CRUDO/i })).toBeVisible();
});

test('guard admin: el dashboard sin sesión redirige al login', async ({ page }) => {
  await page.goto('/admin/dashboard');
  // RequireAdmin redirige a /admin (login) si no hay sesión.
  await expect(page.getByRole('button', { name: /Entrar/i })).toBeVisible();
});
