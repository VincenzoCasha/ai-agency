import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: false,
    include: [
      'tests/**/*.test.js',
      'src/**/*.test.{js,jsx}',
    ],
    // Backend tests (tests/**) corren en Node; frontend (src/**) en jsdom.
    environmentMatchGlobs: [
      ['tests/**', 'node'],
      ['src/**', 'jsdom'],
    ],
    setupFiles: ['./src/test/setup.js'],
    fileParallelism: false,
    poolOptions: {
      forks: { singleFork: true },
    },
    env: {
      NODE_ENV: 'test',
      DB_NAME: process.env.DB_TEST_NAME || 'crudo_test',
      JWT_SECRET: process.env.JWT_SECRET || 'test-jwt-secret-min-32-chars-aaaaaaa',
      JWT_EXPIRES_IN: '15m',
      JWT_REFRESH_EXPIRES_IN: '7d',
      COOKIE_SECRET: process.env.COOKIE_SECRET || 'test-cookie-secret-min-32-chars-aaaa',
      UPLOADS_DIR: process.env.UPLOADS_DIR || 'uploads',
    },
  },
});
