import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';
import { AnimalQuesero } from '../brand/AnimalQuesero';

export function TablaEmptyState() {
  return (
    <div
      role="status"
      className="flex flex-col items-center justify-center text-center py-12 px-4"
    >
      <AnimalQuesero variant="1" size={140} className="mb-6 opacity-90" />
      <h2 className="font-display text-2xl md:text-3xl text-text-primary">
        Aún no has elegido quesos.
      </h2>
      <p className="mt-3 text-text-secondary max-w-prose">
        Empieza por nuestra carta de temporada. Te montamos la cesta y la
        recoges en CRUDO cuando te venga bien.
      </p>
      <Button as={Link} to="/seleccion" size="lg" className="mt-6">
        Ver quesos
      </Button>
    </div>
  );
}
