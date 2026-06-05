import React from 'react';

/**
 * Fallback de Suspense para rutas lazy. Sobrio y mobile-first:
 * ocupa el alto mínimo del viewport y muestra un spinner discreto en
 * la paleta de marca, sin saltos bruscos de layout.
 */
export function RouteLoading() {
  return (
    <div
      className="flex items-center justify-center px-6"
      style={{ minHeight: '60vh' }}
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Cargando…</span>
      <span
        aria-hidden="true"
        className="inline-block h-7 w-7 rounded-full border-2 border-border border-t-accent animate-spin"
      />
    </div>
  );
}
