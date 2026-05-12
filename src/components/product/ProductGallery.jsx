import React, { useState } from 'react';
import { cn } from '../../lib/cn';

export function ProductGallery({ images = [], productName }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const valid = images.filter((img) => img && img.url);
  const active = valid[activeIndex] || valid[0];

  if (valid.length === 0) {
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
