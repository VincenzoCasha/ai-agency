import React from 'react';
import { PageScaffold } from '../components/PageScaffold';

export default function MyTablaConfirmationPage() {
  return (
    <PageScaffold
      eyebrow="Mi Tabla"
      title="Pedido recibido."
      intro="Confirmaremos por WhatsApp en menos de 24 horas dentro del horario de apertura. El pago se realiza en CRUDO al recoger. El detalle real con order_id, total y resumen llega con la integracion del flujo Mi Tabla."
    />
  );
}
