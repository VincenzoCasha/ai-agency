import React from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { cn } from '../../lib/cn';
import { TABLA_MAX_QTY } from '../../lib/tablaDraft';

function formatPrice(cents) {
  if (cents == null || Number.isNaN(Number(cents))) return null;
  const n = Number(cents) / 100;
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);
}

export function TablaLineItem({ item, onRemove, onIncrement, onDecrement, compact = false }) {
  if (!item) return null;
  const subtotal = formatPrice((item.price_cents || 0) * item.quantity);
  const unit = formatPrice(item.price_cents);

  return (
    <li
      className={cn(
        'flex items-center gap-3 py-3 border-b border-border last:border-b-0',
        compact ? 'text-sm' : 'text-base',
      )}
    >
      <div
        className={cn('shrink-0 bg-bg-elevated rounded-md overflow-hidden', compact ? 'w-12 h-12' : 'w-16 h-16')}
        aria-hidden="true"
      >
        {item.image_url ? (
          <img src={item.image_url} alt="" className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-text-muted font-display">
            CRUDO
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className={cn('font-display leading-tight text-text-primary', compact ? 'text-base' : 'text-lg')}>
          {item.name}
        </p>
        {unit ? (
          <p className="font-mono text-xs text-text-muted">
            {unit} × {item.quantity}
          </p>
        ) : null}
      </div>
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onDecrement?.(item)}
          disabled={item.quantity <= 1}
          aria-label={`Reducir ${item.name}`}
          className="min-w-[36px] min-h-[36px] inline-flex items-center justify-center rounded-md border border-border text-text-primary hover:border-gold disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <Minus size={14} aria-hidden="true" />
        </button>
        <span className="font-mono text-sm w-6 text-center" aria-live="polite">{item.quantity}</span>
        <button
          type="button"
          onClick={() => onIncrement?.(item)}
          disabled={item.quantity >= TABLA_MAX_QTY}
          aria-label={`Aumentar ${item.name}`}
          className="min-w-[36px] min-h-[36px] inline-flex items-center justify-center rounded-md border border-border text-text-primary hover:border-gold disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <Plus size={14} aria-hidden="true" />
        </button>
      </div>
      <div className="text-right shrink-0">
        {subtotal ? (
          <p className="font-mono text-sm text-text-primary" aria-label={`Subtotal ${item.name}`}>
            {subtotal}
          </p>
        ) : null}
        <button
          type="button"
          onClick={() => onRemove?.(item)}
          aria-label={`Quitar ${item.name}`}
          className="mt-1 inline-flex items-center gap-1 text-xs text-text-muted hover:text-error focus-visible:outline-none focus-visible:underline"
        >
          <X size={12} aria-hidden="true" />
          Quitar
        </button>
      </div>
    </li>
  );
}
