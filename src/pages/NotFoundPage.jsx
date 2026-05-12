import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { PageScaffold } from '../components/PageScaffold';

export default function NotFoundPage() {
  return (
    <PageScaffold
      eyebrow="404"
      title="No hemos encontrado esta pagina."
      intro="Quizas el enlace este antiguo. Vuelve al inicio o pasa por el catalogo para ver lo que tenemos esta semana."
    >
      <div className="flex gap-3">
        <Button as={Link} to="/" variant="primary">Volver al inicio</Button>
        <Button as={Link} to="/catalogo" variant="secondary">Ver catalogo</Button>
      </div>
    </PageScaffold>
  );
}
