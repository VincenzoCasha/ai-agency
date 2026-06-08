import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright E2E — CRUDO V2 (Fase 9).
 *
 * Estrategia: la API (`/api/v1/**`) va MOCKEADA en cada test vía
 * `page.route` (ver `e2e/fixtures/mockApi.js`). No se necesita ni Express ni
 * MariaDB para correr la suite -> rápida, determinista y CI-friendly. El
 * alcohol guard de BACKEND (422) ya está cubierto por los tests de servidor en
 * `tests/`; aquí se cubre el guard de FRONTEND (vino -> solo WhatsApp; Mi Tabla
 * no admite alcohol).
 *
 * webServer levanta solo Vite (`npm run dev:client`). Mobile-first: el proyecto
 * primario es un viewport de móvil.
 */
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never' }]],
  timeout: 30_000,
  expect: { timeout: 7_000 },

  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      // Primario: móvil (el diseño es mobile-first). Emulación de viewport
      // iPhone sobre chromium (no instalamos webkit; iPhone Safari real queda
      // como QA manual — ver docs/qa-checklist.md).
      name: 'mobile',
      use: { ...devices['iPhone 13'], browserName: 'chromium' },
    },
    {
      name: 'desktop',
      use: { ...devices['Desktop Chrome'], viewport: { width: 1280, height: 800 } },
    },
  ],

  webServer: {
    command: 'npm run dev:client',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
