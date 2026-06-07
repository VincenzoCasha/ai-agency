import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { V2_ASSETS } from '../../lib/v2Assets';

const STRIPS = [
  {
    to: '/catalogo/quesos',
    eyebrow: 'Vitrina',
    title: 'Quesos artesanos',
    desc: 'Curados, frescos y de pasta lavada. Selección rotativa cada mes.',
    asset: V2_ASSETS['strip-vitrina'],
    alt: 'Quesos artesanos en la barra de CRUDO Madrid',
  },
  {
    to: '/tablas',
    eyebrow: 'Para llevar',
    title: 'Tablas listas',
    desc: 'De 3, 6 u 8 quesos. Maridaje opcional acordado por WhatsApp.',
    asset: V2_ASSETS['strip-tablas'],
    alt: 'Tablas de quesos listas para llevar en CRUDO',
  },
  {
    to: '/catalogo/temporada',
    eyebrow: 'Esta semana',
    title: 'De temporada',
    desc: 'Lo que ha llegado fresco a la vitrina. Cambia cada semana.',
    asset: V2_ASSETS['strip-temporada'],
    alt: 'Selección de temporada en CRUDO',
  },
];

export function CategoryStrips() {
  return (
    <section
      aria-labelledby="cats-heading"
      className="container-page py-12 md:py-20"
    >
      <h2 id="cats-heading" className="sr-only">
        Categorías destacadas
      </h2>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border rounded-md overflow-hidden">
        {STRIPS.map((strip) => (
          <li key={strip.to}>
            <Link
              to={strip.to}
              className="group relative block h-full overflow-hidden bg-bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              style={{ minHeight: '320px' }}
            >
              <img
                src={strip.asset.src}
                srcSet={strip.asset.srcSet}
                sizes="(max-width: 768px) 100vw, 33vw"
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                style={{ filter: 'brightness(1.1) contrast(1.07) saturate(1.05)' }}
              />
              <div
                className="absolute inset-0"
                aria-hidden="true"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(26,31,20,0.18) 0%, rgba(26,31,20,0.5) 60%, rgba(26,31,20,0.85) 100%)',
                }}
              />
              <div className="relative h-full p-6 md:p-8 flex flex-col justify-end">
                <p className="eyebrow text-crudo-bone mb-3">{strip.eyebrow}</p>
                <h3 className="font-display text-2xl md:text-3xl text-text-inverse mb-2">
                  {strip.title}
                </h3>
                <p className="text-sm text-text-inverse opacity-90 max-w-prose">
                  {strip.desc}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm text-text-inverse group-hover:gap-2 transition-all">
                  Ver <ArrowUpRight size={14} aria-hidden="true" />
                </span>
              </div>
              <span className="sr-only">{strip.alt}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
