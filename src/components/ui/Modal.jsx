import React, { useEffect, useRef } from 'react';
import { cn } from '../../lib/cn';
import { IconButton } from './IconButton';
import { X } from 'lucide-react';

/**
 * Modal accesible minimo:
 *  - role="dialog" + aria-modal.
 *  - aria-labelledby con titulo.
 *  - cierra con Escape.
 *  - foco devuelve al trigger al cerrar.
 *  - bloquea scroll de body mientras esta abierto.
 */
export function Modal({ open, onClose, title, children, labelledBy, className }) {
  const dialogRef = useRef(null);
  const previouslyFocused = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    previouslyFocused.current = typeof document !== 'undefined' ? document.activeElement : null;
    if (typeof document !== 'undefined') {
      document.body.style.overflow = 'hidden';
    }
    function onKey(e) {
      if (e.key === 'Escape') onClose?.();
    }
    if (typeof window !== 'undefined') {
      window.addEventListener('keydown', onKey);
    }
    // Focus inicial: el dialog.
    setTimeout(() => dialogRef.current?.focus(), 0);
    return () => {
      if (typeof window !== 'undefined') window.removeEventListener('keydown', onKey);
      if (typeof document !== 'undefined') document.body.style.overflow = '';
      const prev = previouslyFocused.current;
      if (prev && typeof prev.focus === 'function') {
        try { prev.focus(); } catch { /* ignore */ }
      }
    };
  }, [open, onClose]);

  if (!open) return null;

  const labelId = labelledBy || 'modal-title';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onMouseDown={(e) => {
        // Click en el backdrop cierra; click dentro no.
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div className="absolute inset-0 bg-black/60" aria-hidden="true" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelId}
        tabIndex={-1}
        className={cn(
          'relative w-full max-w-lg rounded-md border border-border-strong bg-bg-secondary p-6 shadow-elevated',
          'focus:outline-none',
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4">
          {title ? (
            <h2 id={labelId} className="font-display text-2xl">
              {title}
            </h2>
          ) : null}
          <IconButton aria-label="Cerrar" onClick={onClose}>
            <X size={20} aria-hidden="true" />
          </IconButton>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
