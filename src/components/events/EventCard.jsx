import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, MapPin, MessageCircle } from 'lucide-react';
import { EventCapacityBadge } from './EventCapacityBadge';
import { Button } from '../ui/Button';

function formatPrice(cents) {
  if (cents == null || Number.isNaN(Number(cents))) return null;
  const n = Number(cents) / 100;
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);
}

function formatDate(iso) {
  if (!iso) return '';
  try {
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
    }).format(new Date(iso));
  } catch {
    return '';
  }
}

function formatDateBox(iso) {
  if (!iso) return { day: '', month: '' };
  try {
    const d = new Date(iso);
    return {
      day: String(d.getDate()).padStart(2, '0'),
      month: new Intl.DateTimeFormat('es-ES', { month: 'short' }).format(d).toUpperCase(),
    };
  } catch {
    return { day: '', month: '' };
  }
}

function formatTime(iso) {
  if (!iso) return '';
  try {
    return new Intl.DateTimeFormat('es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(iso));
  } catch {
    return '';
  }
}

/**
 * EventCard — dos variantes según si el evento tiene imagen:
 * · Poster (3:4): cuando event.hero_image_url existe — la foto del cartel es el héroe
 * · Date-box (fallback): caja de fecha terracota cuando no hay cartel
 *
 * La prop `featured` añade el copy de confirmación por WhatsApp bajo el CTA.
 */
export function EventCard({ event, featured = false }) {
  if (!event) return null;
  const href = `/eventos/${event.slug}`;
  const price = formatPrice(event.price_cents);
  const hasPoster = Boolean(event.hero_image_url);
  const { day: dateDay, month: dateMonth } = formatDateBox(event.starts_at);
  const timeStr = formatTime(event.starts_at);
  const dateStr = formatDate(event.starts_at);

  // ── Variante POSTER (3:4) ────────────────────────────────────────────────
  if (hasPoster) {
    return (
      <article className="group flex flex-col bg-bg-secondary border border-border rounded-md overflow-hidden transition-colors hover:border-border-strong hover:-translate-y-0.5 hover:shadow-elevated">
        <Link
          to={href}
          className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
        >
          <div className="relative overflow-hidden" style={{ aspectRatio: '3 / 4' }}>
            <img
              src={event.hero_image_url}
              alt={`Cartel del evento ${event.title}`}
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute top-3 left-3">
              <EventCapacityBadge event={event} />
            </div>
          </div>
        </Link>
        <div className="flex flex-col gap-2 p-5 flex-1">
          <h3 className="font-display text-xl leading-tight text-text-primary">
            <Link
              to={href}
              className="hover:text-gold focus-visible:outline-none focus-visible:underline"
            >
              {event.title}
            </Link>
          </h3>
          <p className="text-sm text-text-secondary">
            {dateStr}
            {timeStr ? ` · ${timeStr}` : null}
            {event.location ? ` · ${event.location}` : null}
          </p>
          <div className="mt-auto pt-3 flex items-center justify-between gap-3 border-t border-border">
            {price ? (
              <span className="font-mono text-sm font-medium text-text-primary">{price}</span>
            ) : (
              <span aria-hidden="true" />
            )}
            <Button as={Link} to={href} size="sm">
              Reservar
            </Button>
          </div>
          {featured && (
            <p className="text-xs text-text-secondary leading-relaxed pt-2 border-t border-border">
              Te confirmamos la plaza por WhatsApp y te enviamos un link de pago.
              Pagas online, disfrutas en CRUDO.
            </p>
          )}
        </div>
      </article>
    );
  }

  // ── Variante DATE-BOX (fallback cuando no hay cartel) ───────────────────
  return (
    <article className="group flex flex-col bg-bg-secondary border border-border rounded-md overflow-hidden transition-colors hover:border-border-strong hover:-translate-y-0.5 hover:shadow-elevated">
      <div className="flex gap-4 p-5">
        {/* Caja de fecha — terracota */}
        <div className="flex-shrink-0 w-16 rounded-md border border-border bg-bg-elevated text-center py-3 h-fit">
          <div className="font-display text-2xl text-gold leading-none">{dateDay}</div>
          <div className="text-[10px] font-semibold tracking-eyebrow text-text-muted uppercase mt-1">{dateMonth}</div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex gap-2 flex-wrap mb-2">
            <EventCapacityBadge event={event} />
          </div>
          <h3 className="font-display text-lg leading-tight text-text-primary">
            <Link
              to={href}
              className="hover:text-gold focus-visible:outline-none focus-visible:underline"
            >
              {event.title}
            </Link>
          </h3>
          <ul className="text-sm text-text-secondary space-y-1 mt-2">
            {event.starts_at ? (
              <li className="inline-flex items-center gap-1.5">
                <Clock size={13} aria-hidden="true" />
                {timeStr}
              </li>
            ) : null}
            {event.location ? (
              <li className="inline-flex items-center gap-1.5">
                <MapPin size={13} aria-hidden="true" />
                {event.location}
              </li>
            ) : null}
          </ul>
          {event.description ? (
            <p className="text-sm text-text-secondary mt-2 line-clamp-2">{event.description}</p>
          ) : null}
        </div>
      </div>
      <div className="px-5 pb-5 flex items-center justify-between gap-3 border-t border-border pt-3 mt-auto">
        <div>
          {price ? (
            <span className="font-mono text-sm font-medium text-text-primary">{price}</span>
          ) : null}
        </div>
        <Button as={Link} to={href} size="sm">
          Ver evento
        </Button>
      </div>
      {featured && (
        <p className="px-5 pb-4 text-xs text-text-secondary leading-relaxed border-t border-border pt-3">
          Te confirmamos la plaza por WhatsApp y te enviamos un link de pago.
          Pagas online, disfrutas en CRUDO.
        </p>
      )}
    </article>
  );
}
