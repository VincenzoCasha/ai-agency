import React from 'react';
import { RetroSign } from '../components/brand/RetroSign';
import { ResponsiveImage } from '../components/ui/ResponsiveImage';
import { EventList } from '../components/events/EventList';
import { CelebraStrip } from '../components/events/CelebraStrip';
import { useEvents } from '../hooks/useEvents';
import { useSiteConfig } from '../hooks/useSiteConfig';
import { useSeo } from '../hooks/useSeo';
import { V2_ASSETS } from '../lib/v2Assets';

const GALLERY_MOMENTS = [
  {
    assetId: 'gallery-despedida',
    quote: '... tengo una despedida de soltera. ¡Vamos a CRUDO!',
  },
  {
    assetId: 'gallery-ascenso',
    quote: 'Me han ascendido en el trabajo. ¡Vamos a CRUDO!',
  },
  {
    assetId: 'gallery-cita',
    quote: 'Primera cita. ¡Vamos a CRUDO!',
  },
];

export default function EventsPage() {
  const { events, status, loading, error } = useEvents();
  const { config } = useSiteConfig();

  useSeo({
    title: 'Eventos',
    description:
      'Catas, talleres y bodegas invitadas en CRUDO, Madrid. Reserva tu plaza; te confirmamos por WhatsApp.',
    path: '/eventos',
    image: '/img/v2/eventos-hero-1200.webp',
  });

  return (
    <main>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="events-page-heading"
        className="relative isolate overflow-hidden border-b border-border"
        style={{ minHeight: '65vh' }}
      >
        <ResponsiveImage
          assetId="eventos-hero"
          sizes="100vw"
          eager
          decorative
          className="absolute inset-0 -z-20 h-full w-full object-cover"
          style={{ filter: 'brightness(1.08) contrast(1.06) saturate(1.05)' }}
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{ background: 'linear-gradient(180deg, rgba(26,31,20,0.12) 0%, rgba(26,31,20,0.45) 55%, rgba(26,31,20,0.78) 100%)' }}
        />
        <div className="container-page flex flex-col justify-end pt-20 pb-12 md:min-h-[45vh] md:py-16">
          <RetroSign text="Eventos" size="sm" className="self-start mb-4" />
          <h1
            id="events-page-heading"
            className="font-display text-4xl md:text-6xl text-text-inverse leading-[1.05] max-w-2xl"
          >
            Catas, talleres y bodegas invitadas.
          </h1>
          <p className="mt-4 text-text-inverse opacity-90 text-lg max-w-prose">
            Eventos pequeños alrededor de la barra. Reserva tu plaza online y
            paga en CRUDO al llegar.
          </p>
        </div>
      </section>

      {/* ── Próximos eventos ─────────────────────────────────────────────── */}
      <section className="container-page py-10 md:py-14">
        <EventList events={events} status={status} loading={loading} error={error} />
      </section>

      {/* ── Galería de momentos ──────────────────────────────────────────── */}
      <section aria-label="Momentos en CRUDO" className="border-t border-border">
        <ul className="grid grid-cols-3">
          {GALLERY_MOMENTS.map((moment) => {
            const asset = V2_ASSETS[moment.assetId];
            return (
              <li key={moment.assetId} className="group overflow-hidden" style={{ maxHeight: '320px' }}>
                {asset ? (
                  <img
                    src={asset.src}
                    srcSet={asset.srcSet}
                    sizes="33vw"
                    alt={asset.alt}
                    loading="lazy"
                    decoding="async"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ filter: 'brightness(1.05) contrast(1.04) saturate(1.03)', display: 'block' }}
                  />
                ) : null}
              </li>
            );
          })}
        </ul>
      </section>

      <CelebraStrip siteConfig={config} />
    </main>
  );
}
