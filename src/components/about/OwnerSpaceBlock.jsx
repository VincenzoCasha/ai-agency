import React from 'react';
import { LifestylePhoto } from '../brand/LifestylePhoto';
import { AnimalQuesero } from '../brand/AnimalQuesero';

const PHOTOS = [
  {
    src: '/img/about/mostrador-quesera.jpg',
    alt: 'Mostrador de CRUDO con queseras y producto en exposición',
    cap: 'Vitrina',
  },
  {
    src: '/img/about/mostrador-vino.jpg',
    alt: 'Mostrador con botellas de vino seleccionado y producto a la venta',
    cap: 'Selección',
  },
  {
    src: '/img/about/owner-mostrador.jpg',
    alt: 'Stefano detrás del mostrador en CRUDO',
    cap: 'Detrás del mostrador',
  },
];

export function OwnerSpaceBlock() {
  return (
    <section
      aria-labelledby="space-heading"
      className="bg-bg-secondary border-y border-border"
    >
      <div className="container-page py-14 md:py-20">
        <div className="flex items-end justify-between flex-wrap gap-3 mb-8">
          <div>
            <p className="eyebrow text-gold mb-2">El local</p>
            <h2
              id="space-heading"
              className="font-display italic text-3xl md:text-4xl text-text-primary leading-tight"
            >
              Una tienda con barra al fondo.
            </h2>
          </div>
        </div>
        <ul className="grid gap-4 md:grid-cols-3">
          {PHOTOS.map((p) => (
            <li key={p.src} className="space-y-2">
              <LifestylePhoto
                src={p.src}
                alt={p.alt}
                aspectRatio="aspect-[4/5]"
                className="rounded-md border border-border"
              />
              <p className="text-xs uppercase tracking-eyebrow text-text-muted">{p.cap}</p>
            </li>
          ))}
        </ul>
        <div className="mt-12 flex flex-col md:flex-row items-center gap-6 md:gap-10 border-t border-border pt-10">
          <AnimalQuesero variant="2" size={120} className="shrink-0" />
          <p className="text-text-secondary max-w-prose">
            Si vienes con tiempo, te enseñamos la vitrina pieza a pieza y te
            dejamos catar antes de elegir. Si vienes con prisa, te montamos
            la tabla en cinco minutos.
          </p>
        </div>
      </div>
    </section>
  );
}
