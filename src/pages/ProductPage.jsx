import React from 'react';
import { useParams } from 'react-router-dom';
import { PageScaffold } from '../components/PageScaffold';

export default function ProductPage() {
  const { slug } = useParams();
  return (
    <PageScaffold
      eyebrow="Producto"
      title={`Detalle del producto ${slug}`}
      intro="La ficha real con galeria, descripcion larga, maridaje y variantes se conecta en la siguiente fase. Los productos con alcohol nunca se anaden a Mi Tabla; el CTA sera siempre WhatsApp."
    />
  );
}
