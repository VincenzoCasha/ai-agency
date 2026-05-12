import React, { useState } from 'react';
import { cn } from '../../lib/cn';

const FALLBACK_BY_TYPE = {
  CHEESE: { src: '/img/lifestyle/tabla-quesos-vino.jpg', alt: 'Tabla de quesos artesanos en CRUDO' },
  WINE: { src: '/img/lifestyle/cata-vinos-naturales.jpg', alt: 'Botellas de vino natural en CRUDO' },
};

export function ProductGallery({ images = [], productName, productType }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const valid = images.filter((img) => img && img.url);
  const active = valid[activeIndex] || valid[0];

  if (valid.length === 0) {
    const fallback = FALLBACK_BY_TYPE[(productType || '').toUpperCase()];
    if (fallback) {
      return (
        <div
          className="relative bg-bg-secondary border border-border rounded-md overflow-hidden"
          style={{ aspectRatio: '1 / 1' }}
        >
          <img
            src={fallback.src}
            alt={fallback.alt}
            className="absolute inset-0 w-full h-full object-cover opacity-75"
            loading="eager"
          />
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ background: 'linear-gradient(180deg, rgba(26,31,20,0.25) 0%, rgba(26,31,20,0.7) 100%)' }}
          >
            <span className="font-display italic text-3xl md:text-5xl text-crudo-bone/95 px-4 text-center">
              {productName}
            </span>
          </div>
        </div>
      );
    }
    return (
      <div
        className="bg-bg-secondary border border-border rounded-md flex items-center justify-center"
        style={{ aspectRatio: '1 / 1' }}
        aria-label={`Imagen no disponible para ${productName}`}
      >
        <span className="font-display italic text-5xl text-text-muted opacity-40">
          CRUDO
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <div
        className="relative bg-bg-secondary border border-border rounded-md overflow-hidden"
        style={{ aspectRatio: '1 / 1' }}
      >
        <img
          key={active.url}
          src={active.url}
          alt={active.alt_text || productName || ''}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>
      {valid.length > 1 ? (
        <ul className="grid grid-cols-4 gap-2" aria-label="Galería">
          {valid.map((img, i) => (
            <li key={img.id || `${img.url}-${i}`}>
              <button
                type="button"
                onClick={() => setActiveIndex(i)}
                aria-label={`Ver imagen ${i + 1} de ${productName || 'producto'}`}
                aria-current={i === activeIndex ? 'true' : undefined}
                className={cn(
                  'block w-full rounded-md overflow-hidden border',
                  i === activeIndex ? 'border-gold' : 'border-border hover:border-border-strong',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
                )}
                style={{ aspectRatio: '1 / 1' }}
              >
                <img
                  src={img.url}
                  alt=""
                  loading="lazy"
                  className="w-full h-full object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
