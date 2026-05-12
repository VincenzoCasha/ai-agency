import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Hero } from '../components/home/Hero';

const SITE_CONFIG = {
  brand: 'CRUDO',
  contact: { google_maps_url: 'https://maps.example/crudo' },
  hours: {
    mon: '17:30-23:00',
    tue: '17:30-23:00',
    wed: '17:30-23:00',
    thu: '17:30-23:00',
    fri: '17:30-23:00',
    sat: '12:30-22:00',
    sun: '12:30-20:00',
  },
};

describe('Hero', () => {
  it('renders eyebrow, single H1, intro and both CTAs', () => {
    render(
      <MemoryRouter>
        <Hero siteConfig={SITE_CONFIG} cta={{ primaryHref: '/catalogo', primaryLabel: 'Reservar mi tabla' }} />
      </MemoryRouter>,
    );
    expect(screen.getByText(/Vinos y quesos · Madrid/i)).toBeInTheDocument();
    const headings = screen.getAllByRole('heading', { level: 1 });
    expect(headings).toHaveLength(1);
    expect(screen.getByRole('link', { name: /Reservar mi tabla/i })).toHaveAttribute('href', '/catalogo');
    const mapsLink = screen.getByRole('link', { name: /Cómo llegar/i });
    expect(mapsLink).toHaveAttribute('href', 'https://maps.example/crudo');
    expect(mapsLink).toHaveAttribute('target', '_blank');
  });

  it('does not show english copy', () => {
    render(
      <MemoryRouter>
        <Hero siteConfig={SITE_CONFIG} />
      </MemoryRouter>,
    );
    expect(screen.queryByText(/Book your/i)).toBeNull();
    expect(screen.queryByText(/Find us/i)).toBeNull();
    expect(screen.queryByText(/Add to cart/i)).toBeNull();
  });
});
