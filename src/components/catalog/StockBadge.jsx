import React from 'react';
import { Badge } from '../ui/Badge';

export function StockBadge({ stockStatus }) {
  if (stockStatus === 'OUT') {
    return (
      <Badge tone="warning" aria-label="Producto agotado">
        Agotado
      </Badge>
    );
  }
  if (stockStatus === 'LOW') {
    return (
      <Badge tone="accent" aria-label="Pocas unidades disponibles">
        Pocas unidades
      </Badge>
    );
  }
  return null;
}
