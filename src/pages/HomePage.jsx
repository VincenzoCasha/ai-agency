import React, { useEffect } from 'react';
import { Hero } from '../components/home/Hero';
import { SeasonalShowcase } from '../components/home/SeasonalShowcase';
import { CategoryStrips } from '../components/home/CategoryStrips';
import { EventsTeaser } from '../components/home/EventsTeaser';
import { InstagramStrip } from '../components/home/InstagramStrip';
import { VisitBlock } from '../components/home/VisitBlock';
import { useSiteConfig } from '../hooks/useSiteConfig';
import { useTablaDraft } from '../hooks/useTablaDraft';

export default function HomePage() {
  const { config } = useSiteConfig();
  const { count } = useTablaDraft();

  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.title = 'CRUDO — Tienda de quesos y cheese bar en Madrid';
    }
    const desc = 'Quesos artesanos, tablas para llevar y eventos en pleno centro de Madrid.';
    if (typeof document !== 'undefined') {
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute('content', desc);
    }
  }, []);

  const primaryHref = count > 0 ? '/mi-tabla' : '/catalogo';
  const primaryLabel = count > 0 ? `Ir a Mi Tabla (${count})` : 'Reservar mi tabla';

  return (
    <>
      <Hero
        siteConfig={config}
        cta={{ primaryHref, primaryLabel }}
      />
      <SeasonalShowcase whatsappNumber={config?.contact?.whatsapp_public} />
      <CategoryStrips />
      <EventsTeaser />
      <InstagramStrip instagramUrl={config?.contact?.instagram} />
      <VisitBlock siteConfig={config} />
    </>
  );
}
