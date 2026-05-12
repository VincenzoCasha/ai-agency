import React from 'react';
import { CatalogView } from '../components/catalog/CatalogView';

export default function CatalogQuesoPage() {
  return (
    <CatalogView
      pageEyebrow="Vitrina"
      pageTitle="Quesos artesanos"
      pageIntro="Curados, frescos, azules y de pasta lavada. Filtra por origen o intensidad. Disponibilidad real en la vitrina puede variar; si dudas, pregúntanos."
      fixedFilters={{ type: 'CHEESE' }}
      showSeasonalToggle
    />
  );
}
