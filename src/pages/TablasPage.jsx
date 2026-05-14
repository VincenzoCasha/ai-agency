import React, { useEffect } from 'react';
import { RetroSign } from '../components/brand/RetroSign';
import { TablaMaridajeSelector } from '../components/tabla/TablaMaridajeSelector';
import { useSiteConfig } from '../hooks/useSiteConfig';

export default function TablasPage() {
  const { config } = useSiteConfig();

  useEffect(() => {
    document.title = 'Tablas · CRUDO';
  }, []);

  return (
    <main>
      <section
        aria-labelledby="tablas-heading"
        className="relative isolate overflow-hidden border-b border-border"
        style={{ minHeight: '40vh' }}
      >
        <img
          src="/img/lifestyle/tabla-quesos-vino-pro.jpg"
          alt=""
          aria-hidden="true"
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{ background: 'linear-gradient(180deg, rgba(246,241,228,0.55) 0%, rgba(246,241,228,0.92) 100%)' }}
        />
        <div className="container-page flex flex-col justify-end pt-20 pb-10 md:min-h-[40vh] md:py-14">
          <RetroSign text="Tablas para llevar" size="sm" className="self-start mb-4" />
          <h1
            id="tablas-heading"
            className="font-display italic text-4xl md:text-6xl text-text-primary leading-[1.05] max-w-2xl"
          >
            Tres tamaños, tu maridaje.
          </h1>
        </div>
      </section>

      <section className="container-page py-10 md:py-14 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14 items-start">
        <div className="max-w-prose">
          <h2 className="font-display italic text-2xl md:text-3xl text-text-primary leading-tight mb-4">
            Cómo son nuestras tablas.
          </h2>
          <ul className="space-y-3 text-text-secondary">
            <li>
              <strong className="text-text-primary">60-70 g por queso</strong>{' '}
              de diferentes tipos de leche, elegidos por nuestra frommellier.
            </li>
            <li>
              <strong className="text-text-primary">Acompañadas</strong> de
              frutos secos y frutas de temporada.
            </li>
            <li>
              <strong className="text-text-primary">Maridaje opcional:</strong>{' '}
              vino blanco seco o afrutado, tinto ligero o con cuerpo. Si
              prefieres natural, dínoslo.
            </li>
            <li>
              <strong className="text-text-primary">Reserva por WhatsApp,</strong>{' '}
              pagas en CRUDO al recoger. Confirmamos en menos de 24 h.
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-sm uppercase tracking-eyebrow text-text-muted mb-4">
            Configura tu tabla
          </h2>
          <TablaMaridajeSelector siteConfig={config} />
        </div>
      </section>
    </main>
  );
}
