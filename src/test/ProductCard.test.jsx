import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ProductCard } from '../components/catalog/ProductCard';
import {
  clearDraft,
  TABLA_DRAFT_STORAGE_KEY,
} from '../lib/tablaDraft';

const CHEESE = {
  id: 1,
  slug: 'manchego-curado',
  name: 'Manchego curado',
  type: 'CHEESE',
  short_desc: 'Curado de oveja, 12 meses.',
  price_cents: 1450,
  stock_status: 'IN',
  is_alcohol: false,
  is_seasonal: true,
  is_featured: false,
  producer: 'Quesos La Mesa',
  region: 'Castilla-La Mancha',
  images: [{ url: '/img/cheese.jpg', alt_text: 'Manchego curado' }],
};

const WINE = {
  ...CHEESE,
  id: 2,
  slug: 'rioja-reserva',
  name: 'Rioja Reserva',
  type: 'WINE',
  is_alcohol: true,
  is_seasonal: false,
};

const OUT_CHEESE = {
  ...CHEESE,
  id: 3,
  slug: 'cabra-payoyo',
  name: 'Cabra payoyo',
  stock_status: 'OUT',
  is_seasonal: false,
};

function renderCard(product) {
  return render(
    <MemoryRouter>
      <ProductCard product={product} whatsappNumber="+34600123456" />
    </MemoryRouter>,
  );
}

describe('ProductCard', () => {
  beforeEach(() => {
    window.localStorage.removeItem(TABLA_DRAFT_STORAGE_KEY);
    clearDraft();
  });

  it('renders cheese with price, seasonal tag and Añadir button', () => {
    renderCard(CHEESE);
    expect(screen.getByText('Manchego curado')).toBeInTheDocument();
    expect(screen.getByText(/14,50/)).toBeInTheDocument();
    expect(screen.getByText('Temporada')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Añadir Manchego curado a Mi Cesta/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText(/WhatsApp/i)).toBeNull();
  });

  it('wine product never shows "Añadir" — shows WhatsApp CTA only', () => {
    renderCard(WINE);
    expect(
      screen.queryByRole('button', { name: /Añadir/i }),
    ).toBeNull();
    const link = screen.getByRole('link', { name: /Consultar Rioja Reserva por WhatsApp/i });
    expect(link).toHaveAttribute('href');
    expect(link.getAttribute('href')).toMatch(/wa\.me\/34600123456/);
    expect(decodeURIComponent(link.getAttribute('href'))).toContain('Rioja Reserva');
  });

  it('disables Añadir when stock is OUT and shows badge', () => {
    renderCard(OUT_CHEESE);
    expect(screen.getByText(/Agotado/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Añadir Cabra payoyo a Mi Cesta/i }),
    ).toBeDisabled();
  });

  it('links to the product detail page', () => {
    renderCard(CHEESE);
    const detailLinks = screen.getAllByRole('link');
    const detail = detailLinks.find((l) => l.getAttribute('href') === '/producto/manchego-curado');
    expect(detail).toBeTruthy();
  });

  it('uses editorial fallback by type when product has no images (CHEESE)', () => {
    const noImage = { ...CHEESE, images: [] };
    renderCard(noImage);
    // Fallback editorial 1:1 optimizado (manifest V2)
    const img = screen.getByAltText(/Queso artesano de CRUDO/i);
    expect(img).toBeInTheDocument();
    expect(img.getAttribute('src')).toMatch(/fallback-queso/);
  });

  it('uses editorial fallback by type when product has no images (WINE)', () => {
    const noImageWine = { ...WINE, images: [] };
    renderCard(noImageWine);
    const img = screen.getByAltText(/Maridaje de vino natural en CRUDO/i);
    expect(img).toBeInTheDocument();
    expect(img.getAttribute('src')).toMatch(/fallback-maridaje/);
  });
});
