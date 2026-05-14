import React from 'react';
import { RetroSign } from '../brand/RetroSign';
import { SaffronTileBackground } from '../brand/SaffronTileBackground';
import { LifestylePhoto } from '../brand/LifestylePhoto';

export function MaridajesStrip() {
  return (
    <SaffronTileBackground
      as="section"
      intensity="subtle"
      aria-labelledby="maridajes-heading"
      className="bg-bg-secondary border-y border-border"
    >
      <div className="container-page py-14 md:py-20 grid gap-10 md:grid-cols-2 md:gap-14 items-center">
        <div>
          <RetroSign text="Maridajes" size="sm" className="mb-3" />
          <h2
            id="maridajes-heading"
            className="font-display text-3xl md:text-4xl text-text-primary"
          >
            Vino natural, queso de autor.
          </h2>
          <p className="mt-4 text-text-secondary text-lg max-w-prose">
            Te montamos la tabla y te sugerimos el vino que la acompaña. Si
            quieres acertar a la primera, escríbenos por WhatsApp y acordamos
            blanco o tinto según lo que vayas a comer.
          </p>
          <p className="mt-3 text-sm text-text-muted italic">
            Los vinos se reservan y se pagan en CRUDO.
          </p>
        </div>
        <LifestylePhoto
          src="/img/lifestyle/cata-vinos-naturales-pro.jpg"
          alt="Tres botellas de vinos naturales con plato de quesos y bowl de crackers sobre azulejo amarillo de CRUDO"
          aspectRatio="aspect-[4/5]"
          className="rounded-md border border-border-strong shadow-elevated"
        />
      </div>
    </SaffronTileBackground>
  );
}
