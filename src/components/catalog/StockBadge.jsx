import React from 'react';
import { Badge } from '../ui/Badge';
import { availabilityFor } from '../../lib/availability';

/**
 * Badge de disponibilidad editorial (no inventario). Muestra "Pocas unidades"
 * o "Agotado"; cuando hay disponibilidad normal no renderiza nada.
 * Copy y tono vienen de src/lib/availability.js (fuente única).
 */
export function StockBadge({ stockStatus }) {
  const a = availabilityFor(stockStatus);
  if (!a.showBadge) return null;
  return (
    <Badge tone={a.tone} aria-label={`Disponibilidad: ${a.customer}`}>
      {a.customer}
    </Badge>
  );
}
