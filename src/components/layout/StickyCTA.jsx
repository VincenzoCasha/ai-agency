import React from 'react';
import { useLocation } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Button } from '../ui/Button';
import { useTablaDraft } from '../../hooks/useTablaDraft';

/**
 * Sticky CTA mobile-first. No tapamos el footer ni el banner de cookies:
 * solo se muestra fuera de paginas legales y de la propia Mi Tabla.
 * No activa pago — invita a montar la tabla y reservar pickup.
 */
const HIDDEN_PATHS = [
  '/mi-tabla',
  '/aviso-legal',
  '/privacidad',
  '/cookies',
  '/admin',
];

export function StickyCTA({ onOpenTabla }) {
  const { pathname } = useLocation();
  const { count } = useTablaDraft();
  if (HIDDEN_PATHS.some((p) => pathname.startsWith(p))) return null;

  const label = count > 0 ? `Mi Tabla (${count})` : 'Monta tu tabla';
  const aria = count > 0
    ? `Abrir Mi Tabla con ${count} ${count === 1 ? 'producto' : 'productos'}`
    : 'Montar tu tabla';

  return (
    <div
      className="md:hidden fixed inset-x-0 bottom-0 z-20 px-4 pb-3 pt-2 bg-bg-primary/95 backdrop-blur border-t border-border"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0) + 0.75rem)' }}
    >
      <Button type="button" onClick={onOpenTabla} block size="lg" aria-label={aria}>
        <ShoppingBag size={18} aria-hidden="true" />
        {label}
      </Button>
    </div>
  );
}
