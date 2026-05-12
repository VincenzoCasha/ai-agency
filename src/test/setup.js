import '@testing-library/jest-dom/vitest';

// Limpieza despues de cada test (frontend). Vitest 1.x carga
// `@testing-library/react`'s `cleanup()` automaticamente cuando
// detecta jsdom env, pero lo reforzamos aqui por si el modo `jsdom`
// del config no aplica el plugin de auto-cleanup.
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

afterEach(() => {
  cleanup();
});
