import React from 'react';
import { RetroSign } from '../brand/RetroSign';

export function AboutIntro() {
  return (
    <header
      className="relative isolate overflow-hidden border-b border-border"
      style={{ minHeight: '60vh' }}
    >
      <img
        src="/img/about/owner-mostrador.jpg"
        alt=""
        aria-hidden="true"
        loading="eager"
        fetchPriority="high"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10"
        style={{
          background:
            'linear-gradient(90deg, rgba(26,31,20,0.78) 0%, rgba(26,31,20,0.55) 45%, rgba(26,31,20,0.20) 75%, rgba(26,31,20,0) 100%)',
        }}
      />
      <div className="container-page flex flex-col justify-end pt-24 pb-16 md:min-h-[60vh] md:py-20">
        <RetroSign text="Sobre CRUDO" size="sm" className="self-start mb-4" />
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl text-text-primary leading-[1.05] max-w-3xl">
          Quesos artesanos y vinos naturales, en pleno centro de Madrid.
        </h1>
        <p className="mt-5 text-text-secondary text-lg max-w-prose">
          CRUDO es una tienda primero y una barra después. Seleccionamos
          quesos de pequeños productores, los probamos antes de ponerlos en
          vitrina y los montamos en tabla para llevar o degustar aquí.
        </p>
      </div>
    </header>
  );
}
