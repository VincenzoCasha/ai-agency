import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, MessageCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { RetroSign } from '../brand/RetroSign';
import { EventCapacityBadge } from './EventCapacityBadge';
import { ReservationForm } from './ReservationForm';
import { FormSuccess } from '../forms/FormSuccess';
import { buildGenericUrl } from '../../lib/whatsapp';
import { trackWhatsAppClick } from '../../lib/analytics';
import { V2_ASSETS } from '../../lib/v2Assets';

const FALLBACK_HERO = V2_ASSETS['eventos-hero']?.src || '/img/lifestyle/cata-vinos-naturales-pro.jpg';

function formatDate(iso) {
  if (!iso) return '';
  try {
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long', day: '2-digit', month: 'long', year: 'numeric',
    }).format(new Date(iso));
  } catch { return ''; }
}

function formatTime(iso) {
  if (!iso) return '';
  try {
    return new Intl.DateTimeFormat('es-ES', { hour: '2-digit', minute: '2-digit' }).format(new Date(iso));
  } catch { return ''; }
}

function formatPrice(cents) {
  if (cents == null) return null;
  const n = Number(cents) / 100;
  return new Intl.NumberFormat('es-ES', {
    style: 'currency', currency: 'EUR',
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);
}

export function EventDetail({ event, siteConfig }) {
  const [confirmation, setConfirmation] = useState(null);
  if (!event) return null;
  const heroSrc = event.hero_image_url || FALLBACK_HERO;
  const price = formatPrice(event.price_cents);
  const whatsapp = siteConfig?.contact?.whatsapp_public;

  return (
    <article>
      <header className="relative isolate overflow-hidden" style={{ minHeight: '55vh' }}>
        <img
          src={heroSrc}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          loading="eager"
          fetchPriority="high"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{ background: 'linear-gradient(180deg, rgba(26,31,20,0.45) 0%, rgba(26,31,20,0.85) 100%)' }}
        />
        <div className="container-page flex flex-col justify-end pt-24 pb-12 md:min-h-[55vh] md:py-20">
          <RetroSign text="Evento" size="sm" className="self-start mb-4" />
          <h1 className="font-display text-4xl md:text-6xl text-text-primary leading-[1.05] max-w-3xl">
            {event.title}
          </h1>
          <ul className="mt-5 flex flex-wrap gap-4 text-text-secondary">
            {event.starts_at ? (
              <li className="inline-flex items-center gap-1.5">
                <Calendar size={16} aria-hidden="true" />
                <span>{formatDate(event.starts_at)}</span>
              </li>
            ) : null}
            {event.starts_at ? (
              <li className="inline-flex items-center gap-1.5">
                <Clock size={16} aria-hidden="true" />
                <span>
                  {formatTime(event.starts_at)}
                  {event.ends_at ? ` – ${formatTime(event.ends_at)}` : null}
                </span>
              </li>
            ) : null}
            {event.location ? (
              <li className="inline-flex items-center gap-1.5">
                <MapPin size={16} aria-hidden="true" />
                <span>{event.location}</span>
              </li>
            ) : null}
          </ul>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <EventCapacityBadge event={event} />
            {price ? (
              <span className="font-mono text-sm text-text-primary">{price}</span>
            ) : null}
          </div>
        </div>
      </header>

      <div className="container-page py-10 md:py-14 grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14 items-start">
        <section aria-labelledby="event-desc-heading" className="max-w-prose">
          <h2 id="event-desc-heading" className="text-sm uppercase tracking-eyebrow text-text-muted mb-3">
            Sobre el evento
          </h2>
          {event.description ? (
            <div className="font-body text-text-primary text-base leading-relaxed whitespace-pre-line">
              {event.description}
            </div>
          ) : (
            <p className="text-text-secondary">
              Pronto añadimos más detalles. Si quieres preguntar por este evento,
              escríbenos por WhatsApp.
            </p>
          )}
        </section>

        <aside aria-labelledby="event-reserve-heading">
          <h2 id="event-reserve-heading" className="text-sm uppercase tracking-eyebrow text-text-muted mb-3">
            Reserva tu plaza
          </h2>
          {confirmation ? (
            <FormSuccess
              title="¡Solicitud recibida!"
              message="Te confirmamos la reserva por email o WhatsApp en cuanto la procesemos. El pago se realiza en CRUDO al llegar."
            />
          ) : event.is_full ? (
            <div className="rounded-md border border-border bg-bg-secondary p-5 space-y-4">
              <p className="text-text-primary font-semibold">Evento completo.</p>
              <p className="text-sm text-text-secondary">
                Si quieres que te avisemos si se libera plaza o de la próxima
                edición, escríbenos por WhatsApp.
              </p>
              {whatsapp ? (
                <Button
                  as="a"
                  href={buildGenericUrl(whatsapp)}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackWhatsAppClick({ source: 'event_full' })}
                  variant="secondary"
                >
                  <MessageCircle size={16} aria-hidden="true" />
                  Avísame
                </Button>
              ) : null}
            </div>
          ) : (
            <>
              <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                Te confirmamos la plaza por WhatsApp y te enviamos un link de pago.
                Pagas online, disfrutas en CRUDO.
              </p>
              <ReservationForm
                eventSlug={event.slug}
                eventTitle={event.title}
                onSuccess={({ confirmation: c }) => setConfirmation(c || true)}
              />
            </>
          )}
          <p className="mt-6 text-xs text-text-muted">
            <Link to="/eventos" className="underline hover:text-text-primary">
              Volver a la agenda
            </Link>
          </p>
        </aside>
      </div>
    </article>
  );
}
