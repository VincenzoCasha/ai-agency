import React from 'react';
import { CatalogView } from '../components/catalog/CatalogView';

export default function SeasonalPage() {
  return (
    <CatalogView
      pageEyebrow="Esta semana"
      pageTitle="Quesos de temporada"
      pageIntro="La selección que ha llegado fresca a la vitrina. Cambia cada semana según producción y madurez."
      fixedFilters={{ seasonal: true }}
    />
  );
}
