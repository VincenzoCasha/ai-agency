import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, MapPin } from 'lucide-react';
import { RetroSign } from '../brand/RetroSign';
import { Button } from '../ui/Button';
import { buildGenericUrl } from '../../lib/whatsapp';
import { trackWhatsAppClick, trackMapsClick } from '../../lib/analytics';

function formatPrice(cents) {
  if (cents == null || Number.isNaN(Number(cents))) return null;
  const n = Number(cents) / 100;
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);
}

export function PickupSuccess({ confirmation, siteConfig }) {
  const orderId = confirmation?.order_id || confirmation?.id || null;
  const total = formatPrice(confirmation?.total_cents);
  const items = Array.isArray(confirmation?.items) ? confirmation.items : [];
  const whatsapp = siteConfig?.contact?.whatsapp_public;
  const maps = siteConfig?.contact?.google_maps_url;

  return (
    <article className="container-page py-12 md:py-16 max-w-2xl">
      <RetroSign text="¡Pedido recibido!" size="lg" className="mb-5" />
      <h1 className="font-display text-4xl md:text-5xl text-text-primary leading-tight">
        Te confirmamos por WhatsApp.
      </h1>
      <p className="mt-4 text-text-secondary text-lg">
        Te confirmamos en menos de 24 horas dentro del horario de apertura.{' '}
        <strong className="text-text-primary">El pago se realiza en CRUDO al recoger.</strong>
      </p>

      <dl className="mt-8 grid gap-4 sm:grid-cols-2">
        {orderId ? (
          <div className="bg-bg-secondary border border-border rounded-md p-4">
            <dt className="eyebrow text-text-muted text-[0.65rem] mb-1">Referencia</dt>
            <dd className="font-mono text-sm text-text-primary">{orderId}</dd>
          </div>
        ) : null}
        {total ? (
          <div className="bg-bg-secondary border border-border rounded-md p-4">
            <dt className="eyebrow text-text-muted text-[0.65rem] mb-1">Total estimado</dt>
            <dd className="font-mono text-lg text-text-primary">{total}</dd>
          </div>
        ) : null}
      </dl>

      {items.length > 0 ? (
        <section aria-labelledby="confirmation-items-heading" className="mt-8">
          <h2 id="confirmation-items-heading" className="text-sm uppercase tracking-eyebrow text-text-muted mb-3">
            Tu tabla
          </h2>
          <ul className="divide-y divide-border border border-border rounded-md">
            {items.map((item, i) => (
              <li key={item.id || item.slug || i} className="flex justify-between gap-3 p-3 text-sm">
                <span className="text-text-primary">{item.name || item.slug || item.id}</span>
                <span className="font-mono text-text-secondary">× {item.quantity ?? item.qty ?? '?'}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="mt-8 flex flex-wrap gap-3">
        {whatsapp ? (
          <Button
            as="a"
            href={buildGenericUrl(whatsapp)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick({ source: 'pickup_confirmation' })}
            variant="primary"
            size="lg"
          >
            <MessageCircle size={18} aria-hidden="true" />
            Hablar por WhatsApp
          </Button>
        ) : null}
        {maps ? (
          <Button
            as="a"
            href={maps}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackMapsClick({ source: 'pickup_confirmation' })}
            variant="secondary"
            size="lg"
          >
            <MapPin size={18} aria-hidden="true" />
            Cómo llegar
          </Button>
        ) : null}
      </div>

      <p className="mt-10 text-sm text-text-muted">
        ¿Necesitas otra cosa?{' '}
        <Link to="/catalogo" className="underline hover:text-text-primary">
          Volver al catálogo
        </Link>
        .
      </p>
    </article>
  );
}
