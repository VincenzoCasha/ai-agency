import React from 'react';
import { Link } from 'react-router-dom';
import { EventCard } from './EventCard';
import { Button } from '../ui/Button';

function isFuture(event, now = Date.now()) {
  if (!event?.starts_at) return true;
  const t = new Date(event.starts_at).getTime();
  return !Number.isNaN(t) && t >= now;
}

function sortByStartAsc(a, b) {
  const ta = new Date(a?.starts_at || 0).getTime();
  const tb = new Date(b?.starts_at || 0).getTime();
  return ta - tb;
}

export function EventList({ events = [], loading, status, error }) {
  if (loading) {
    return (
      <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3" aria-busy="true">
        {[0, 1, 2].map((i) => (
          <li
            key={i}
            className="bg-bg-secondary border border-border rounded-md animate-pulse"
            style={{ minHeight: '320px' }}
          />
        ))}
      </ul>
    );
  }

  if (status === 'error') {
    return (
      <div role="alert" className="rounded-md border border-error/50 bg-error/10 p-5 text-sm">
        <p className="text-text-primary font-semibold">No pudimos cargar los eventos.</p>
        <p className="mt-1 text-text-secondary">
          Refresca la página o vuelve a intentarlo en un momento. ({error?.detail || 'error desconocido'})
        </p>
      </div>
    );
  }

  const upcoming = events.filter((e) => isFuture(e)).sort(sortByStartAsc);

  if (upcoming.length === 0) {
    return (
      <div className="rounded-md border border-border bg-bg-secondary p-8 text-center">
        <h2 className="font-display text-2xl text-text-primary">
          Sin eventos por ahora.
        </h2>
        <p className="mt-3 text-text-secondary max-w-prose mx-auto">
          Estamos preparando las próximas catas. Si quieres que te avisemos,
          escríbenos por WhatsApp o pásate por la tienda.
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Button as={Link} to="/contacto" variant="secondary">
            Contacto
          </Button>
        </div>
      </div>
    );
  }

  return (
    <ul className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {upcoming.map((event, idx) => (
        <li key={event.id || event.slug}>
          <EventCard event={event} featured={idx === 0} />
        </li>
      ))}
    </ul>
  );
}
