import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, ChevronRight } from 'lucide-react';
import { EventCapacityBadge } from './EventCapacityBadge';

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

const FALLBACK_HERO = '/img/lifestyle/cata-vinos-naturales-pro.jpg';

export function EventCard({ event }) {
  if (!event) return null;
  const href = `/eventos/${event.slug}`;
  const price = formatPrice(event.price_cents);
  const heroSrc = event.hero_image_url || FALLBACK_HERO;
  const heroAlt = event.hero_image_alt
    || `Imagen del evento ${event.title}`;

  return (
    <article className="group flex flex-col bg-bg-secondary border border-border rounded-md overflow-hidden transition-colors hover:border-border-strong">
      <Link
        to={href}
        className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
      >
        <div className="relative" style={{ aspectRatio: '16 / 9' }}>
          <img
            src={heroSrc}
            alt={heroAlt}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: 'linear-gradient(180deg, rgba(26,31,20,0.05) 0%, rgba(26,31,20,0.7) 100%)' }}
          />
          <div className="absolute top-3 left-3">
            <EventCapacityBadge event={event} />
          </div>
        </div>
      </Link>
      <div className="flex flex-col gap-2 p-5 flex-1">
        <p className="inline-flex items-center gap-1.5 text-xs text-gold uppercase tracking-eyebrow">
          <Calendar size={14} aria-hidden="true" />
          {formatDate(event.starts_at)}
        </p>
        <h3 className="font-display text-2xl leading-tight text-text-primary">
          <Link
            to={href}
            className="hover:text-gold focus-visible:outline-none focus-visible:underline"
          >
            {event.title}
          </Link>
        </h3>
        <ul className="text-sm text-text-secondary space-y-1 mt-1">
          {event.starts_at ? (
            <li className="inline-flex items-center gap-1.5">
              <Clock size={14} aria-hidden="true" />
              {formatTime(event.starts_at)}
              {event.ends_at ? ` – ${formatTime(event.ends_at)}` : null}
            </li>
          ) : null}
          {event.location ? (
            <li className="inline-flex items-center gap-1.5">
              <MapPin size={14} aria-hidden="true" />
              {event.location}
            </li>
          ) : null}
        </ul>
        <div className="mt-auto pt-3 flex items-center justify-between gap-3">
          {price ? (
            <span className="font-mono text-sm text-text-primary">{price}</span>
          ) : (
            <span aria-hidden="true" />
          )}
          <Link
            to={href}
            className="inline-flex items-center gap-1 text-sm text-gold group-hover:gap-2 transition-all focus-visible:outline-none focus-visible:underline"
            aria-label={`Ver evento ${event.title}`}
          >
            Ver evento <ChevronRight size={14} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
