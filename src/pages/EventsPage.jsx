import React from 'react';
import { PageScaffold } from '../components/PageScaffold';

export default function EventsPage() {
  return (
    <PageScaffold
      eyebrow="Eventos"
      title="Catas, talleres y bodegas invitadas."
      intro="El listado real de eventos futuros se conecta en la siguiente fase con el endpoint publico, mostrando plazas restantes y formulario de reserva."
    />
  );
}
