import React from 'react';
import { Instagram } from 'lucide-react';
import { RetroSign } from '../brand/RetroSign';

const CURATED = [
  { src: '/img/lifestyle/tabla-quesos-vino-pro.jpg', alt: 'Tabla de quesos con copas de vino' },
  { src: '/img/lifestyle/bodegon-cartel-crudo-pro.jpg', alt: 'Bodegón con cartel retroiluminado CRUDO' },
  { src: '/img/lifestyle/cata-vinos-naturales-pro.jpg', alt: 'Cata de vinos naturales con plato de quesos' },
  { src: '/img/lifestyle/vino-natural-mano-pro.jpg', alt: 'Botella de vino natural en mano' },
];

export function InstagramStrip({ instagramUrl }) {
  return (
    <section
      aria-labelledby="instagram-heading"
      className="container-page py-12 md:py-16"
    >
      <header className="flex items-end justify-between flex-wrap gap-3 mb-6">
        <div>
          <RetroSign text="Día a día" size="sm" className="mb-3" />
          <h2
            id="instagram-heading"
            className="font-display italic text-3xl md:text-4xl text-text-primary"
          >
            En Instagram
          </h2>
        </div>
        {instagramUrl ? (
          <a
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary"
          >
            <Instagram size={16} aria-hidden="true" />
            @crudomov
          </a>
        ) : null}
      </header>
      <ul
        className="grid grid-cols-2 md:grid-cols-4 gap-2"
        aria-label="Selección de fotos de CRUDO"
      >
        {CURATED.map((photo, i) => (
          <li key={i}>
            <div
              className="relative overflow-hidden rounded-md border border-border bg-bg-elevated"
              style={{ aspectRatio: '1 / 1' }}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-text-muted italic">
        Selección editorial; la integración real con Instagram llegará más adelante.
      </p>
    </section>
  );
}
