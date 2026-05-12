import React from 'react';
import { PageScaffold } from '../components/PageScaffold';

export default function MyTablaPage() {
  return (
    <PageScaffold
      eyebrow="Mi Tabla"
      title="Tu seleccion para llevar."
      intro="El carrito y el formulario de pickup se conectan en la siguiente fase contra `POST /api/v1/pickup-orders`. El backend ya rechaza cualquier item con alcohol con HTTP 422; las variantes de tabla con vino se acuerdan por WhatsApp."
    />
  );
}
