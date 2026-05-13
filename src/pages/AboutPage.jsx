import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AboutIntro } from '../components/about/AboutIntro';
import { ManifestoBlock } from '../components/about/ManifestoBlock';
import { OwnerSpaceBlock } from '../components/about/OwnerSpaceBlock';

export default function AboutPage() {
  useEffect(() => {
    document.title = 'Sobre CRUDO · Madrid';
  }, []);

  return (
    <main>
      <AboutIntro />
      <ManifestoBlock />
      <OwnerSpaceBlock />
      <section className="container-page py-14 md:py-20 max-w-prose">
        <h2 className="font-display italic text-2xl md:text-3xl text-text-primary mb-3">
          ¿Qué quieres hacer?
        </h2>
        <ul className="text-text-primary text-base space-y-2">
          <li>
            <Link to="/catalogo/quesos" className="underline hover:text-gold">
              Ver el catálogo de quesos
            </Link>
          </li>
          <li>
            <Link to="/eventos" className="underline hover:text-gold">
              Ver próximos eventos
            </Link>
          </li>
          <li>
            <Link to="/celebra-con-nosotros" className="underline hover:text-gold">
              Celebrar tu evento en CRUDO
            </Link>
          </li>
          <li>
            <Link to="/contacto" className="underline hover:text-gold">
              Escribirnos
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
