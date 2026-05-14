import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

const STRIPS = [
  {
    to: '/catalogo/quesos',
    eyebrow: 'Vitrina',
    title: 'Quesos artesanos',
    desc: 'Curados, frescos y de pasta lavada. Selección rotativa cada mes.',
    image: '/img/lifestyle/tabla-quesos-vino-pro.jpg',
    alt: 'Tabla de quesos curados con uvas y nueces sobre azulejo amarillo de CRUDO',
  },
  {
    to: '/tablas',
    eyebrow: 'Para llevar',
    title: 'Tablas listas',
    desc: 'De 3, 6 u 8 quesos. Maridaje opcional acordado por WhatsApp.',
    image: '/img/lifestyle/bodegon-cartel-crudo-pro.jpg',
    alt: 'Botellas de vino y copas en el local de CRUDO con cartel retroiluminado al fondo',
  },
  {
    to: '/catalogo/temporada',
    eyebrow: 'Esta semana',
    title: 'De temporada',
    desc: 'Lo que ha llegado fresco a la vitrina. Cambia cada semana.',
    image: '/img/lifestyle/cata-vinos-naturales-pro.jpg',
    alt: 'Tres botellas de vinos naturales con plato de quesos y crackers',
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
                src={strip.image}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div
                className="absolute inset-0"
                aria-hidden="true"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(26,31,20,0.35) 0%, rgba(26,31,20,0.75) 70%, rgba(26,31,20,0.92) 100%)',
                }}
              />
              <div className="relative h-full p-6 md:p-8 flex flex-col justify-end">
                <p className="eyebrow text-crudo-bone/80 mb-3">{strip.eyebrow}</p>
                <h3 className="font-display italic text-2xl md:text-3xl text-text-primary mb-2">
                  {strip.title}
                </h3>
                <p className="text-sm text-text-secondary max-w-prose">
                  {strip.desc}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm text-gold group-hover:gap-2 transition-all">
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
