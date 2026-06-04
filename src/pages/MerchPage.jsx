import React, { useEffect } from 'react';
import { ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { RetroSign } from '../components/brand/RetroSign';

const MERCH_ITEMS = [
  { label: 'Taza', desc: 'Edición limitada · próximamente' },
  { label: 'Bolsa', desc: 'Tote bag CRUDO · próximamente' },
  { label: 'Print', desc: 'Póster de temporada · próximamente' },
];

const INSTAGRAM_URL = 'https://www.instagram.com/crudomov';

export default function MerchPage() {
  useEffect(() => {
    document.title = 'Merch · CRUDO';
  }, []);

  return (
    <main>
      {/* Hero */}
      <section
        className="container-page py-16 md:py-24 grid gap-14 lg:grid-cols-[1fr_1.1fr] lg:gap-20 items-center"
        aria-labelledby="merch-heading"
      >
        <div>
          <RetroSign text="Próximamente" size="sm" className="mb-5" />
          <h1
            id="merch-heading"
            className="font-display text-5xl md:text-7xl text-text-primary leading-[0.96]"
          >
            Merch<br />CRUDO
          </h1>
          <p className="mt-6 text-text-secondary text-lg leading-relaxed max-w-prose">
            Tazas, bolsas, prints y objetos de la casa.
            Mientras tanto síguenos en Instagram para ver las novedades.
          </p>
          <div className="mt-8">
            <Button
              as="a"
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              size="lg"
            >
              Ir a @crudomov
              <ExternalLink size={15} aria-hidden="true" />
            </Button>
          </div>
        </div>

        {/* Placeholders de producto */}
        <div className="grid grid-cols-3 gap-4">
          {MERCH_ITEMS.map((item) => (
            <div key={item.label} className="flex flex-col gap-3">
              <div
                className="rounded-md border border-border overflow-hidden"
                style={{ aspectRatio: '1' }}
              >
                {/* Placeholder animado hasta que existan fotos reales */}
                <div className="w-full h-full bg-bg-elevated flex flex-col items-center justify-center gap-2 relative">
                  <span className="absolute top-2 left-2 text-[10px] font-semibold uppercase tracking-[0.12em] bg-[#FEDB9A] text-[#5b3a0e] px-2 py-1 rounded-full">
                    Pronto
                  </span>
                  <span className="font-mono text-[10px] text-text-muted text-center px-2">
                    {item.label} · próximamente
                  </span>
                </div>
              </div>
              <p className="text-xs text-text-muted text-center">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA secundario */}
      <section className="border-t border-border bg-bg-secondary">
        <div className="container-page py-10 md:py-14 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="font-display text-2xl text-text-primary">
              ¿Quieres que te avisemos?
            </h2>
            <p className="mt-2 text-text-secondary text-sm max-w-prose">
              Síguenos en Instagram o escríbenos por WhatsApp.
              Serás el primero en saberlo cuando lancemos.
            </p>
          </div>
          <Button
            as="a"
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            variant="primary"
            size="lg"
          >
            Seguir en Instagram
            <ExternalLink size={15} aria-hidden="true" />
          </Button>
        </div>
      </section>
    </main>
  );
}
