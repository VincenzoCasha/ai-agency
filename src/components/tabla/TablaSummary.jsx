import React from 'react';
import { TablaLineItem } from './TablaLineItem';

function formatPrice(cents) {
  if (cents == null || Number.isNaN(Number(cents))) return null;
  const n = Number(cents) / 100;
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);
}

export function TablaSummary({ items, totalCents, onRemove, onIncrement, onDecrement, compact = false }) {
  return (
    <div>
      <ul aria-label="Tu tabla" className="divide-y divide-border">
        {items.map((item) => (
          <TablaLineItem
            key={item.id ?? item.slug}
            item={item}
            onRemove={onRemove}
            onIncrement={onIncrement}
            onDecrement={onDecrement}
            compact={compact}
          />
        ))}
      </ul>
      <div className="mt-4 pt-3 border-t border-border-strong flex items-center justify-between">
        <span className="font-semibold uppercase tracking-eyebrow text-xs text-text-muted">
          Total estimado
        </span>
        <span className="font-mono text-lg text-text-primary">
          {formatPrice(totalCents) || '—'}
        </span>
      </div>
      <p className="mt-2 text-xs text-text-muted italic">
        El total se confirma en CRUDO al recoger. CRUDO recalcula el precio
        autoritativo con los datos del día.
      </p>
    </div>
  );
}
