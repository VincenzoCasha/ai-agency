import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag } from 'lucide-react';
import { Button } from '../ui/Button';

/**
 * Sticky CTA mobile-first. No tapamos el footer ni el banner de cookies:
 * solo se muestra fuera de paginas legales y de la propia Mi Tabla.
 * No activa pago — invita a montar la tabla y reservar pickup.
 */
const HIDDEN_PATHS = [
  '/mi-tabla',
  '/mi-tabla/confirmacion',
  '/aviso-legal',
  '/privacidad',
  '/cookies',
  '/admin',
];

export function StickyCTA() {
  const { pathname } = useLocation();
  if (HIDDEN_PATHS.some((p) => pathname.startsWith(p))) return null;

  return (
    <div
      className="md:hidden fixed inset-x-0 bottom-0 z-20 px-4 pb-3 pt-2 bg-bg-primary/95 backdrop-blur border-t border-border"
      style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0) + 0.75rem)' }}
    >
      <Button as={Link} to="/mi-tabla" block size="lg">
        <ShoppingBag size={18} aria-hidden="true" />
        Monta tu tabla
      </Button>
    </div>
  );
}
