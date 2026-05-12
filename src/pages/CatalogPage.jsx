import React from 'react';
import { Link } from 'react-router-dom';
import { PageScaffold } from '../components/PageScaffold';

export default function CatalogPage() {
  return (
    <PageScaffold
      eyebrow="Catalogo"
      title="Que tenemos esta semana."
      intro="Los quesos rotan mensualmente. Encontraras la seleccion completa en quesos de temporada y tablas para llevar. Las tablas con maridaje de vino se acuerdan por WhatsApp."
    >
      <ul className="grid gap-4 sm:grid-cols-2 max-w-prose">
        <li>
          <Link to="/catalogo/temporada" className="block p-5 rounded-md border border-border bg-bg-secondary hover:border-gold">
            <h2 className="font-display text-2xl">Quesos de temporada</h2>
            <p className="mt-1 text-text-secondary text-sm">Seleccion rotativa cada mes.</p>
          </Link>
        </li>
        <li>
          <Link to="/tablas" className="block p-5 rounded-md border border-border bg-bg-secondary hover:border-gold">
            <h2 className="font-display text-2xl">Tablas para llevar</h2>
            <p className="mt-1 text-text-secondary text-sm">3, 6 u 8 quesos. Maridaje opcional via WhatsApp.</p>
          </Link>
        </li>
      </ul>
    </PageScaffold>
  );
}
