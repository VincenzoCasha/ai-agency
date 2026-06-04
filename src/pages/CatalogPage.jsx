import React from 'react';
import { CatalogView } from '../components/catalog/CatalogView';

export default function CatalogPage() {
  return (
    <CatalogView
      pageEyebrow="Selección del mes"
      pageTitle="Lo que tenemos esta semana."
      pageIntro="Una selección rotativa de quesos de temporada, elegida por nuestra fromelier. Se actualiza cada semana según lo que encontramos en el mercado."
      showSeasonalToggle
    />
  );
}
