import React from 'react';
import { LifestylePhoto } from '../brand/LifestylePhoto';

export function ManifestoBlock() {
  return (
    <section
      aria-labelledby="manifesto-heading"
      className="container-page py-14 md:py-20 grid gap-10 md:grid-cols-2 md:gap-14 items-center"
    >
      <div>
        <p className="eyebrow text-gold mb-3">Manifiesto</p>
        <h2
          id="manifesto-heading"
          className="font-display text-3xl md:text-4xl text-text-primary leading-tight"
        >
          Producto pequeño, mesa cercana.
        </h2>
        <div className="mt-5 space-y-4 text-text-secondary max-w-prose">
          <p>
            Trabajamos con quesos de productores que conocemos y vinos naturales
            que probamos antes de pedir. No vendemos lo que no comemos nosotros.
          </p>
          <p>
            La carta cambia cada mes: lo que llega fresco entra, lo que se
            acaba sale. Si pasas por la tienda te montamos la tabla al momento;
            si prefieres reservarla, lo haces aquí y la recoges luego.
          </p>
          <p>
            En CRUDO no hay menú degustación largo ni reserva de mesa. Solo
            queso bien cortado, vino bien servido y la conversación que toque.
          </p>
        </div>
      </div>
      <LifestylePhoto
        src="/img/lifestyle/bodegon-cartel-crudo-pro.jpg"
        alt="Bodegón en CRUDO con vinos naturales y cartel retroiluminado al fondo"
        aspectRatio="aspect-[4/5]"
        className="rounded-md border border-border shadow-elevated"
      />
    </section>
  );
}
