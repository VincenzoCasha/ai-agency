import React from 'react';
import { CatalogView } from '../components/catalog/CatalogView';

export default function CatalogPage() {
  return (
    <CatalogView
      pageEyebrow="Catálogo"
      pageTitle="Qué tenemos esta semana."
      pageIntro="Selección rotativa de quesos, vinos y tablas listas para llevar. Los vinos se reservan por WhatsApp y se pagan en la tienda al recoger."
      showSeasonalToggle
    />
  );
}
