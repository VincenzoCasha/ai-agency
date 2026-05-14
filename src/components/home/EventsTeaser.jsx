import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ChevronRight } from 'lucide-react';
import { useEvents } from '../../hooks/useEvents';

function formatEventDate(iso) {
  if (!iso) return '';
  try {
    const date = new Date(iso);
    return new Intl.DateTimeFormat('es-ES', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
    }).format(date);
  } catch {
    return '';
  }
}

export function EventsTeaser() {
  const { events, status } = useEvents({ limit: 3 });
  if (status !== 'ok' || events.length === 0) return null;
  const upcoming = events.slice(0, 3);

  return (
    <section
      aria-labelledby="events-heading"
      className="bg-bg-secondary border-y border-border"
    >
      <div className="container-page py-12 md:py-16">
        <header className="flex items-end justify-between flex-wrap gap-3 mb-6">
          <div>
            <p className="eyebrow text-gold mb-2">Próximamente</p>
            <h2
              id="events-heading"
              className="font-display text-3xl md:text-4xl text-text-primary"
            >
              Eventos en CRUDO
            </h2>
          </div>
          <Link
            to="/eventos"
            className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary"
          >
            Ver agenda <ChevronRight size={16} aria-hidden="true" />
          </Link>
        </header>
        <ul className="grid gap-4 md:grid-cols-3">
          {upcoming.map((event) => (
            <li
              key={event.id || event.slug}
              className="border border-border rounded-md bg-bg-primary p-5"
            >
              <Link
                to={`/eventos/${event.slug}`}
                className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
              >
                <p className="inline-flex items-center gap-1.5 text-xs text-gold uppercase tracking-eyebrow mb-3">
                  <Calendar size={14} aria-hidden="true" />
                  {formatEventDate(event.starts_at)}
                </p>
                <h3 className="font-display text-2xl text-text-primary leading-tight">
                  {event.title}
                </h3>
                {event.short_desc ? (
                  <p className="mt-2 text-sm text-text-secondary line-clamp-3">
                    {event.short_desc}
                  </p>
                ) : null}
                {event.seats_left != null ? (
                  <p className="mt-3 text-xs text-text-muted">
                    {event.is_full
                      ? 'Completo'
                      : event.few_seats_left
                        ? `Quedan ${event.seats_left} plazas`
                        : `${event.seats_left} plazas disponibles`}
                  </p>
                ) : null}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
