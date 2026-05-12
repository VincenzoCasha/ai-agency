import React from 'react';
import { CatalogView } from '../components/catalog/CatalogView';

export default function CatalogVinosPage() {
  return (
    <CatalogView
      pageEyebrow="Bodega"
      pageTitle="Vinos de autor"
      pageIntro="Vinos con los que maridamos las tablas. Las reservas y el pago se hacen siempre en CRUDO — escríbenos por WhatsApp y te confirmamos disponibilidad."
      fixedFilters={{ type: 'WINE' }}
      emptyMessage="No hay vinos publicados ahora mismo. Escríbenos por WhatsApp y te decimos qué tenemos abierto."
    />
  );
}
