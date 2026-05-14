import React, { useEffect } from 'react';
import { RetroSign } from '../components/brand/RetroSign';
import { WholesaleForm } from '../components/forms/WholesaleForm';

export default function WholesalePage() {
  useEffect(() => {
    document.title = 'Mayoristas · CRUDO';
  }, []);

  return (
    <main>
      <section
        aria-labelledby="wholesale-heading"
        className="relative isolate overflow-hidden border-b border-border"
        style={{ minHeight: '45vh' }}
      >
        <img
          src="/img/lifestyle/vino-natural-mano-pro.jpg"
          alt=""
          aria-hidden="true"
          loading="eager"
          fetchPriority="high"
          className="absolute inset-0 -z-20 h-full w-full object-cover"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10"
          style={{ background: 'linear-gradient(180deg, rgba(26,31,20,0.45) 0%, rgba(26,31,20,0.85) 100%)' }}
        />
        <div className="container-page flex flex-col justify-end pt-20 pb-12 md:min-h-[45vh] md:py-16">
          <RetroSign text="Horeca y distribución" size="sm" className="self-start mb-4" />
          <h1
            id="wholesale-heading"
            className="font-display italic text-4xl md:text-6xl text-text-primary leading-[1.05] max-w-2xl"
          >
            Quesos artesanos para restaurantes y tiendas.
          </h1>
          <p className="mt-4 text-text-secondary text-lg max-w-prose">
            Si tienes una sala, una tienda o un proyecto y necesitas producto
            seleccionado a mano, podemos abastecerte. Cuéntanos qué buscas y
            te respondemos con disponibilidad y condiciones.
          </p>
        </div>
      </section>

      <section className="container-page py-12 md:py-16 grid gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-14 items-start">
        <div className="max-w-prose">
          <h2 className="font-display italic text-2xl md:text-3xl text-text-primary leading-tight mb-4">
            Cómo trabajamos.
          </h2>
          <ul className="space-y-3 text-text-secondary">
            <li>
              <strong className="text-text-primary">Selección personalizada.</strong>{' '}
              No tenemos lista pública de precios porque cada cliente tiene
              necesidades distintas. Hablamos volumen, frecuencia, gama y te
              pasamos condiciones a medida.
            </li>
            <li>
              <strong className="text-text-primary">Quesos pequeños.</strong>{' '}
              Productores conocidos, lotes acotados, cambio de temporada
              honesto. Te avisamos si algo se agota.
            </li>
            <li>
              <strong className="text-text-primary">Logística pragmática.</strong>{' '}
              Recogida en tienda o entrega negociada según zona. Madrid y
              alrededores con prioridad.
            </li>
          </ul>
          <p className="mt-6 text-sm text-text-muted italic">
            Esto no es una tienda online B2B. Es un canal directo para hablar
            con nosotros.
          </p>
        </div>

        <div>
          <h2 className="text-sm uppercase tracking-eyebrow text-text-muted mb-4">
            Escríbenos
          </h2>
          <WholesaleForm />
        </div>
      </section>
    </main>
  );
}
