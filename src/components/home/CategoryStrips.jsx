import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const STRIPS = [
  {
    to: '/catalogo/quesos',
    eyebrow: 'Vitrina',
    title: 'Quesos artesanos',
    desc: 'Curados, frescos y de pasta lavada. Selección rotativa cada mes.',
  },
  {
    to: '/tablas',
    eyebrow: 'Para llevar',
    title: 'Tablas listas',
    desc: 'De 3, 6 u 8 quesos. Maridaje opcional acordado por WhatsApp.',
  },
  {
    to: '/catalogo/temporada',
    eyebrow: 'Esta semana',
    title: 'De temporada',
    desc: 'Lo que ha llegado fresco a la vitrina. Cambia cada semana.',
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
              className="group block bg-bg-secondary p-6 md:p-8 h-full hover:bg-bg-elevated transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <p className="eyebrow text-text-muted mb-3">{strip.eyebrow}</p>
              <h3 className="font-display italic text-2xl md:text-3xl text-text-primary mb-2">
                {strip.title}
              </h3>
              <p className="text-sm text-text-secondary max-w-prose">
                {strip.desc}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm text-gold group-hover:gap-2 transition-all">
                Ver <ArrowUpRight size={14} aria-hidden="true" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
