import React from 'react';
import { useParams } from 'react-router-dom';
import { PageScaffold } from '../components/PageScaffold';

export default function EventDetailPage() {
  const { slug } = useParams();
  return (
    <PageScaffold
      eyebrow="Evento"
      title={`Detalle del evento ${slug}`}
      intro="La ficha del evento con descripcion, capacidad restante y formulario de reserva se conecta en la siguiente fase."
    />
  );
}
