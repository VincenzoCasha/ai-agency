import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin } from 'lucide-react';
import { Button } from '../ui/Button';
import { RetroSign } from '../brand/RetroSign';
import { trackMapsClick } from '../../lib/analytics';

function isOpenNow(hours) {
  if (!hours || typeof hours !== 'object') return null;
  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
  const now = new Date();
  const today = hours[days[now.getDay()]];
  if (!today || typeof today !== 'string' || !today.includes('-')) return null;
  const [from, to] = today.split('-').map((s) => s.trim());
  const parse = (str) => {
    const [h, m] = str.split(':').map(Number);
    return h * 60 + (m || 0);
  };
  try {
    const minutes = now.getHours() * 60 + now.getMinutes();
    return minutes >= parse(from) && minutes < parse(to);
  } catch {
    return null;
  }
}

export function Hero({ siteConfig, cta }) {
  const mapsUrl = siteConfig?.contact?.google_maps_url;
  const open = isOpenNow(siteConfig?.hours);

  return (
    <section
      aria-label="Bienvenida"
      className="relative isolate overflow-hidden"
      style={{ minHeight: '90vh' }}
    >
      <img
        src="/img/hero/hero-home-cheeseboard-pro.jpg"
        alt=""
        aria-hidden="true"
        loading="eager"
        fetchPriority="high"
        decoding="async"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div
        className="absolute inset-0 -z-10"
        aria-hidden="true"
        style={{
          background:
            'linear-gradient(90deg, rgba(246,241,228,0.92) 0%, rgba(246,241,228,0.72) 40%, rgba(246,241,228,0.28) 70%, rgba(246,241,228,0) 100%)',
        }}
      />
      <div
        className="md:hidden absolute inset-0 -z-10 hero-mobile-min"
        aria-hidden="true"
        style={{ background: 'linear-gradient(180deg, rgba(246,241,228,0.55) 0%, rgba(246,241,228,0.92) 100%)' }}
      />
      <div className="container-page flex flex-col justify-end pt-24 pb-16 md:min-h-[80vh] md:py-24">
        <RetroSign text="Vinos y quesos · Madrid" size="sm" className="self-start mb-5" />
        <h1 className="font-display text-5xl sm:text-6xl md:text-7xl leading-[1.02] max-w-2xl text-text-primary">
          Queso de autor, mesa de barrio.
        </h1>
        <p className="mt-5 text-text-secondary text-lg md:text-xl max-w-prose">
          Selección rotativa cada mes en pleno centro. Reserva tu tabla, pasa
          por la tienda o pídenos un maridaje al gusto.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button as={Link} to={cta?.primaryHref || '/catalogo'} size="lg">
            {cta?.primaryLabel || 'Reservar mi tabla'}
          </Button>
          {mapsUrl ? (
            <Button
              as="a"
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackMapsClick({ source: 'hero' })}
              variant="secondary"
              size="lg"
            >
              <MapPin size={18} aria-hidden="true" />
              Cómo llegar
            </Button>
          ) : null}
        </div>
        {open != null ? (
          <p
            className="mt-6 inline-flex items-center gap-2 text-sm text-text-secondary"
            aria-live="polite"
          >
            <span
              className={`inline-block w-2 h-2 rounded-pill ${open ? 'bg-success' : 'bg-text-muted'}`}
              aria-hidden="true"
            />
            {open ? 'Abierto ahora' : 'Cerrado ahora — ver horario'}
          </p>
        ) : null}
        <div
          aria-hidden="true"
          className="hidden md:block mt-12 text-text-muted text-xs uppercase tracking-eyebrow"
        >
          ↓ Sigue para ver lo de esta semana
        </div>
      </div>
    </section>
  );
}
