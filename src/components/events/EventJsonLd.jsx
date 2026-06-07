import React from 'react';
import { SITE_ORIGIN } from '../../hooks/useSeo';

/**
 * Inyecta JSON-LD schema.org/Event para el detalle de evento (SEO — Fase 8).
 * Sin pago online: offers solo indica precio/moneda y URL de la página.
 */
export function EventJsonLd({ event }) {
  if (!event) return null;

  const data = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    startDate: event.starts_at || undefined,
    endDate: event.ends_at || undefined,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    description: event.description || undefined,
    image: event.hero_image_url ? [event.hero_image_url] : undefined,
    location: {
      '@type': 'Place',
      name: 'CRUDO',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'Calle José Ortega y Gasset 81',
        addressLocality: 'Madrid',
        postalCode: '28006',
        addressCountry: 'ES',
      },
    },
    organizer: { '@type': 'Organization', name: 'CRUDO', url: SITE_ORIGIN },
  };

  if (event.price_cents != null) {
    data.offers = {
      '@type': 'Offer',
      price: (Number(event.price_cents) / 100).toFixed(2),
      priceCurrency: 'EUR',
      url: `${SITE_ORIGIN}/eventos/${event.slug}`,
      availability: event.is_full
        ? 'https://schema.org/SoldOut'
        : 'https://schema.org/InStock',
    };
  }

  // Limpia undefined para un JSON-LD válido.
  const clean = JSON.parse(JSON.stringify(data));

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(clean) }}
    />
  );
}
