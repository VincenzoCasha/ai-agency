/**
 * Disponibilidad EDITORIAL de productos (CRUDO V2 — Fase 6).
 *
 * CRUDO NO lleva inventario por unidades. La DB usa `stock_status` como un
 * estado editorial/comercial (no un contador), e `is_active` para ocultar.
 *
 * Estados:
 * - IN_STOCK → "Disponible"        (se muestra, sin badge)
 * - LOW      → "Pocas unidades"    (se muestra con badge)
 * - OUT      → "Agotado"           (se muestra con badge, no añadible a Mi Tabla)
 * - is_active=false → "Oculto / no publicado" (no aparece en la web pública)
 *
 * Esta es la fuente única de copy para web pública y panel admin (Fase 7).
 */

export const AVAILABILITY = {
  IN_STOCK: {
    id: 'IN_STOCK',
    customer: 'Disponible',
    owner: 'Disponible',
    tone: 'success',
    showBadge: false,
  },
  LOW: {
    id: 'LOW',
    customer: 'Pocas unidades',
    owner: 'Pocas unidades',
    tone: 'accent',
    showBadge: true,
  },
  OUT: {
    id: 'OUT',
    customer: 'Agotado',
    owner: 'Agotado',
    tone: 'warning',
    showBadge: true,
  },
};

/** Etiqueta para producto oculto (is_active=false). Solo visible en admin. */
export const HIDDEN_LABEL = 'Oculto / no publicado';

/** Devuelve el descriptor editorial de un stock_status (fallback: IN_STOCK). */
export function availabilityFor(stockStatus) {
  return AVAILABILITY[stockStatus] || AVAILABILITY.IN_STOCK;
}

/** Opciones que el owner puede elegir en el admin (Fase 7). Sin unidades. */
export const OWNER_AVAILABILITY_OPTIONS = [
  { value: 'IN_STOCK', label: 'Disponible' },
  { value: 'LOW', label: 'Pocas unidades' },
  { value: 'OUT', label: 'Agotado' },
];
