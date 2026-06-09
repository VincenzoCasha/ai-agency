import React from 'react';
import { CatalogView } from '../components/catalog/CatalogView';
import { CajitasSection } from '../components/catalog/CajitasSection';
import { useSeo } from '../hooks/useSeo';

export default function CatalogPage() {
  useSeo({
    title: 'Selección del mes',
    description:
      'La selección rotativa de quesos de temporada de CRUDO, elegida por nuestra fromelier. Se actualiza cada semana.',
    path: '/seleccion',
    image: '/img/v2/seleccion-hero-1200.webp',
  });
  return (
    <>
      <CatalogView
        pageEyebrow="Selección del mes"
        pageTitle="Lo que tenemos esta semana."
        pageIntro="Una selección rotativa de quesos de temporada, elegida por nuestra fromelier. Se actualiza cada semana según lo que encontramos en el mercado."
        showSeasonalToggle
      />
      <div className="container-page">
        <CajitasSection />
      </div>
    </>
  );
}
