import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from '../components/catalog/EmptyState';

describe('EmptyState', () => {
  it('renders title, description and action', () => {
    render(
      <EmptyState
        title="Sin resultados"
        description="Prueba a quitar filtros."
        action={<button type="button">Limpiar</button>}
      />,
    );
    expect(screen.getByText('Sin resultados')).toBeInTheDocument();
    expect(screen.getByText(/quitar filtros/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Limpiar' })).toBeInTheDocument();
  });

  it('exposes role status for AT', () => {
    render(<EmptyState title="Vacío" />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });
});
