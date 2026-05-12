import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { PageScaffold } from '../components/PageScaffold';

export default function HomePage() {
  return (
    <PageScaffold
      eyebrow="Tienda de quesos en Madrid"
      title="Quesos curados, frescos y de temporada para llevar."
      intro="Seleccion artesanal y rotativa cada mes. Reserva tu tabla, pasa por la tienda o pregunta por un maridaje. La estructura visual real llega en la siguiente fase."
    >
      <div className="flex flex-wrap gap-3">
        <Button as={Link} to="/catalogo" variant="primary">Ver catalogo</Button>
        <Button as={Link} to="/mi-tabla" variant="secondary">Monta tu tabla</Button>
        <Button as={Link} to="/eventos" variant="ghost">Proximos eventos</Button>
      </div>
    </PageScaffold>
  );
}
