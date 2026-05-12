import React from 'react';
import { PageScaffold } from '../components/PageScaffold';

export default function ContactPage() {
  return (
    <PageScaffold
      eyebrow="Contacto"
      title="Escribenos."
      intro="El formulario real de contacto y las consultas mayoristas/eventos se conectan en la siguiente fase contra `POST /api/v1/inquiries`. Mientras tanto, los datos publicos viven en el footer."
    />
  );
}
