import React from 'react';
import { PageScaffold } from '../components/PageScaffold';

export default function LegalPage() {
  return (
    <PageScaffold
      eyebrow="Aviso legal"
      title="Aviso legal."
      intro="Texto definitivo basado en plantillas AEPD. Se cargara con el resto del contenido legal antes del lanzamiento."
    >
      <p className="text-text-secondary text-sm max-w-prose">
        CRUDO QUESOS S.L.U · CIF B-19953694 · Calle Jose Ortega y Gasset 81, 28006 Madrid.
      </p>
    </PageScaffold>
  );
}
