import React from 'react';
import { PageScaffold } from '../components/PageScaffold';
import { useSeo } from '../hooks/useSeo';

export default function LegalPage() {
  useSeo({
    title: 'Aviso legal',
    description: 'Aviso legal de CRUDO QUESOS S.L.U — tienda de quesos en Madrid.',
    path: '/aviso-legal',
  });
  return (
    <PageScaffold
      eyebrow="Aviso legal"
      title="Aviso legal."
      intro="Texto pendiente de revisión y validación legal por el titular antes del lanzamiento."
    >
      <div className="text-text-secondary text-sm max-w-prose space-y-4">
        <p>
          <strong className="text-text-primary">Titular:</strong> CRUDO QUESOS S.L.U ·
          CIF B-19953694 · Calle José Ortega y Gasset 81, 28006 Madrid.
        </p>
        <p>
          <strong className="text-text-primary">Venta de alcohol:</strong> CRUDO no
          vende alcohol por internet. Los vinos y maridajes se consultan e informan
          únicamente por WhatsApp y se pagan presencialmente en la tienda. La venta
          y consumo de bebidas alcohólicas está reservada a mayores de 18 años.
        </p>
        <p>
          <strong className="text-text-primary">Pagos:</strong> la web no procesa
          pagos online. Las reservas de tablas y pedidos se abonan en tienda al
          recoger; los eventos se confirman por WhatsApp con un enlace de pago aparte.
        </p>
        <p className="text-text-muted">
          Este texto es una base operativa. El redactado legal definitivo (AEPD) debe
          ser revisado y aprobado por el titular antes del lanzamiento.
        </p>
      </div>
    </PageScaffold>
  );
}
