import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProductMeta } from '../components/product/ProductMeta';
import { clearDraft, TABLA_DRAFT_STORAGE_KEY } from '../lib/tablaDraft';

const CHEESE = {
  id: 1,
  slug: 'manchego-curado',
  name: 'Manchego curado',
  short_desc: 'Curado de oveja, 12 meses.',
  price_cents: 1450,
  stock_status: 'IN',
  is_alcohol: false,
  is_seasonal: true,
  producer: 'Quesos La Mesa',
  region: 'Castilla-La Mancha',
};

const WINE = {
  ...CHEESE,
  id: 2,
  slug: 'rioja-reserva',
  name: 'Rioja Reserva',
  is_alcohol: true,
  is_seasonal: false,
};

function renderMeta(product) {
  return render(
    <MemoryRouter>
      <ProductMeta product={product} whatsappNumber="+34600123456" />
    </MemoryRouter>,
  );
}

describe('ProductMeta', () => {
  beforeEach(() => {
    window.localStorage.removeItem(TABLA_DRAFT_STORAGE_KEY);
    clearDraft();
  });

  it('non-alcohol PDP renders "Añadir a Mi Cesta" button', () => {
    renderMeta(CHEESE);
    expect(
      screen.getByRole('button', { name: /Añadir Manchego curado a Mi Cesta/i }),
    ).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /WhatsApp/i })).toBeNull();
  });

  it('alcohol PDP NEVER renders "Añadir a Mi Cesta" and shows WhatsApp CTA with product name', () => {
    renderMeta(WINE);
    expect(
      screen.queryByRole('button', { name: /Añadir.*Mi Cesta/i }),
    ).toBeNull();
    const link = screen.getByRole('link', {
      name: /Consultar disponibilidad de Rioja Reserva por WhatsApp/i,
    });
    expect(link).toHaveAttribute('href');
    expect(link.getAttribute('href')).toMatch(/wa\.me\/34600123456/);
    expect(decodeURIComponent(link.getAttribute('href'))).toContain('Rioja Reserva');
    expect(
      screen.getByText('Los vinos se reservan y se pagan en CRUDO.'),
    ).toBeInTheDocument();
  });

  it('renders product name, producer/region eyebrow and price', () => {
    renderMeta(CHEESE);
    expect(screen.getByRole('heading', { level: 1, name: 'Manchego curado' })).toBeInTheDocument();
    expect(screen.getByText(/Quesos La Mesa.*Castilla-La Mancha/)).toBeInTheDocument();
    expect(screen.getByLabelText(/Precio/)).toHaveTextContent(/14,50/);
  });
});
