import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { Button } from '../ui/Button';
import { TablaSummary } from './TablaSummary';
import { TablaEmptyState } from './TablaEmptyState';
import { useTablaDraft } from '../../hooks/useTablaDraft';

const PAYMENT_NOTICE =
  'El pago se realiza en CRUDO al recoger. Te confirmaremos por WhatsApp en menos de 24 horas.';

export function TablaDrawer({ open, onClose }) {
  const { items, count, totalCents, removeItem, setQuantity } = useTablaDraft();
  const panelRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    function onKey(ev) {
      if (ev.key === 'Escape') onClose?.();
    }
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Move focus into panel for AT users.
    const node = panelRef.current;
    if (node) {
      const focusable = node.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable) focusable.focus();
    }
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="tabla-drawer-title"
      className="fixed inset-0 z-50 flex"
    >
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute inset-0 bg-black/60"
      />
      <aside
        ref={panelRef}
        className="relative ml-auto h-full w-full max-w-md bg-bg-secondary border-l border-border shadow-elevated flex flex-col"
      >
        <header className="flex items-center justify-between gap-3 px-5 py-4 border-b border-border">
          <div>
            <p className="eyebrow text-text-muted text-[0.65rem]">Tu reserva</p>
            <h2
              id="tabla-drawer-title"
              className="font-display text-2xl text-text-primary leading-tight"
            >
              Mi Cesta
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar Mi Cesta"
            className="min-w-[44px] min-h-[44px] inline-flex items-center justify-center rounded-md text-text-secondary hover:text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {count === 0 ? (
            <TablaEmptyState />
          ) : (
            <>
              <TablaSummary
                items={items}
                totalCents={totalCents}
                compact
                onRemove={(it) => removeItem(it.id)}
                onIncrement={(it) => setQuantity(it.id, (it.quantity || 1) + 1)}
                onDecrement={(it) => setQuantity(it.id, Math.max(1, (it.quantity || 1) - 1))}
              />
              <p className="mt-4 text-xs text-text-muted">
                Para reservar vinos, escríbenos por WhatsApp.
              </p>
            </>
          )}
        </div>

        {count > 0 ? (
          <footer className="px-5 py-4 border-t border-border space-y-3">
            <p className="text-xs text-text-secondary">{PAYMENT_NOTICE}</p>
            <Button as={Link} to="/mi-tabla" block size="lg" onClick={onClose}>
              Reservar para recoger
            </Button>
          </footer>
        ) : null}
      </aside>
    </div>
  );
}
