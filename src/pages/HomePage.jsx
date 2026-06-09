import React from 'react';
import { Hero } from '../components/home/Hero';
import { SeasonalShowcase } from '../components/home/SeasonalShowcase';
import { CategoryStrips } from '../components/home/CategoryStrips';
import { EventsTeaser } from '../components/home/EventsTeaser';
import { VisitBlock } from '../components/home/VisitBlock';
import { useSiteConfig } from '../hooks/useSiteConfig';
import { useTablaDraft } from '../hooks/useTablaDraft';
import { useSeo } from '../hooks/useSeo';

export default function HomePage() {
  const { config } = useSiteConfig();
  const { count } = useTablaDraft();

  useSeo({
    title: 'Tienda de quesos artesanos en Madrid',
    description:
      'CRUDO — tienda de quesos artesanos en el centro de Madrid. Selección del mes, tablas para llevar, maridajes por WhatsApp y eventos.',
    path: '/',
    image: '/img/v2/home-hero-1200.webp',
  });

  const primaryHref = count > 0 ? '/mi-tabla' : '/seleccion';
  const primaryLabel = count > 0 ? `Ir a Mi Cesta (${count})` : 'Reservar mi cesta';

  return (
    <>
      <Hero
        siteConfig={config}
        cta={{ primaryHref, primaryLabel }}
      />
      <EventsTeaser />
      <SeasonalShowcase whatsappNumber={config?.contact?.whatsapp_public} />
      <CategoryStrips />
      <VisitBlock siteConfig={config} />
    </>
  );
}
