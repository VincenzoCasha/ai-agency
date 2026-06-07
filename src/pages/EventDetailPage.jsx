import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { EventDetail } from '../components/events/EventDetail';
import { EventJsonLd } from '../components/events/EventJsonLd';
import { useEvent } from '../hooks/useEvent';
import { useSiteConfig } from '../hooks/useSiteConfig';
import { useSeo } from '../hooks/useSeo';

export default function EventDetailPage() {
  const { slug } = useParams();
  const { event, status, loading } = useEvent(slug);
  const { config } = useSiteConfig();

  useSeo({
    title: event?.title || 'Evento',
    description:
      event?.description?.slice(0, 160) ||
      'Evento en CRUDO, Madrid. Reserva tu plaza; te confirmamos por WhatsApp.',
    path: slug ? `/eventos/${slug}` : '/eventos',
    image: event?.hero_image_url || '/img/v2/eventos-hero-1200.webp',
    type: 'article',
  });

  if (loading) {
    return (
      <main className="container-page py-16">
        <div className="h-12 w-72 bg-bg-secondary rounded-md animate-pulse mb-6" />
        <div className="h-80 bg-bg-secondary rounded-md animate-pulse" />
      </main>
    );
  }

  if (status === 'error' || !event) {
    return (
      <main className="container-page py-16 max-w-prose">
        <h1 className="font-display text-3xl md:text-4xl text-text-primary leading-tight">
          Evento no encontrado.
        </h1>
        <p className="mt-3 text-text-secondary">
          Puede que esté cerrado o que se haya movido. Mira la agenda actual.
        </p>
        <p className="mt-4">
          <Link to="/eventos" className="underline text-text-primary">
            Ver agenda
          </Link>
        </p>
      </main>
    );
  }

  return (
    <main>
      <EventJsonLd event={event} />
      <EventDetail event={event} siteConfig={config} />
    </main>
  );
}
