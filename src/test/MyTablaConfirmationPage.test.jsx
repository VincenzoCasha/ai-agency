import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import MyTablaConfirmationPage from '../pages/MyTablaConfirmationPage';

function renderAt(state) {
  return render(
    <MemoryRouter
      initialEntries={[{ pathname: '/mi-tabla/confirmacion', state }]}
    >
      <Routes>
        <Route path="/mi-tabla/confirmacion" element={<MyTablaConfirmationPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('MyTablaConfirmationPage', () => {
  it('shows safe state when entered without confirmation in nav state', () => {
    renderAt(undefined);
    expect(screen.getByText(/No encontramos tu reserva/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Volver a Mi Cesta/i })).toHaveAttribute('href', '/mi-tabla');
  });

  it('shows pickup success with payment-on-pickup language and order id', () => {
    renderAt({
      confirmation: {
        order_id: 'po_42',
        total_cents: 4350,
        items: [
          { id: 1, slug: 'manchego', name: 'Manchego curado', quantity: 2 },
          { id: 2, slug: 'cabra-fresco', name: 'Cabra fresco', quantity: 1 },
        ],
      },
    });
    expect(screen.getByRole('heading', { level: 1, name: /Te confirmamos por WhatsApp/i })).toBeInTheDocument();
    expect(screen.getByText(/El pago se realiza en CRUDO al recoger/i)).toBeInTheDocument();
    expect(screen.getByText('po_42')).toBeInTheDocument();
    expect(screen.getByText('Manchego curado')).toBeInTheDocument();
    expect(screen.queryByText(/Stripe|pagado online|tarjeta/i)).toBeNull();
  });
});
