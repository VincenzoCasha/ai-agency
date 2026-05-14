import React, { useEffect } from 'react';
import { RetroSign } from '../components/brand/RetroSign';
import { EventList } from '../components/events/EventList';
import { CelebraStrip } from '../components/events/CelebraStrip';
import { NewsletterForm } from '../components/forms/NewsletterForm';
import { useEvents } from '../hooks/useEvents';
import { useSiteConfig } from '../hooks/useSiteConfig';

export default function EventsPage() {
  const { events, status, loading, error } = useEvents();
  const { config } = useSiteConfig();

  useEffect(() => {
    document.title = 'Eventos · CRUDO';
  }, []);

  return (
    <main>
      <section
        aria-labelledby="events-page-heading"
        className="relative isolate overflow-hidden border-b border-border"
        style={{ minHeight: '45vh' }}
      >
        <img
          src="/img/lifestyle/cata-vinos-naturales-pro.jpg"
          alt=""
          aria-hidden="true"
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{ background: 'linear-gradient(180deg, rgba(26,31,20,0.35) 0%, rgba(26,31,20,0.85) 100%)' }}
        />
        <div className="container-page flex flex-col justify-end pt-20 pb-12 md:min-h-[45vh] md:py-16">
          <RetroSign text="Eventos" size="sm" className="self-start mb-4" />
          <h1
            id="events-page-heading"
            className="font-display italic text-4xl md:text-6xl text-text-primary leading-[1.05] max-w-2xl"
          >
            Catas, talleres y bodegas invitadas.
          </h1>
          <p className="mt-4 text-text-secondary text-lg max-w-prose">
            Eventos pequeños alrededor de la barra. Reserva tu plaza online y
            paga en CRUDO al llegar.
          </p>
        </div>
      </section>

      <section className="container-page py-10 md:py-14">
        <EventList events={events} status={status} loading={loading} error={error} />
      </section>

      <CelebraStrip siteConfig={config} />

      <section className="bg-bg-elevated border-t border-border">
        <div className="container-page py-10 md:py-14 max-w-2xl">
          <h2 className="font-display italic text-2xl md:text-3xl text-text-primary mb-2">
            ¿Quieres que te avisemos del próximo evento?
          </h2>
          <p className="text-text-secondary text-sm mb-4">
            Suscríbete a la newsletter y te escribimos antes de que se agoten las plazas.
          </p>
          <NewsletterForm source="events_page" />
        </div>
      </section>
    </main>
  );
}
