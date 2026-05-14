import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TablaMaridajeSelector } from '../components/tabla/TablaMaridajeSelector';

const SITE = {
  contact: { whatsapp_public: '+34 650 13 18 61', email: 'crudomov@gmail.com' },
};

describe('TablaMaridajeSelector', () => {
  it('default state generates a "sin maridaje" WhatsApp link without natural mention', () => {
    render(<TablaMaridajeSelector siteConfig={SITE} />);
    const link = screen.getByRole('link', { name: /Reservar por WhatsApp/i });
    const decoded = decodeURIComponent(link.getAttribute('href'));
    expect(decoded).toMatch(/wa\.me\/34650131861/);
    expect(decoded).toMatch(/3 quesos sin maridaje/i);
    expect(decoded).not.toMatch(/natural/i);
  });

  it('selecting a wine pairing reveals the natural checkbox and includes pairing in WhatsApp text', () => {
    render(<TablaMaridajeSelector siteConfig={SITE} />);
    fireEvent.click(screen.getByLabelText(/Vino tinto ligero/i));
    const checkbox = screen.getByLabelText(/vino natural/i);
    expect(checkbox).toBeInTheDocument();
    fireEvent.click(checkbox);
    fireEvent.click(screen.getByLabelText(/8 quesos/i));
    const link = screen.getByRole('link', { name: /Reservar por WhatsApp/i });
    const decoded = decodeURIComponent(link.getAttribute('href'));
    expect(decoded).toMatch(/8 quesos/i);
    expect(decoded).toMatch(/tinto ligero/i);
    expect(decoded).toMatch(/natural/i);
  });

  it('falls back to email message when no whatsapp configured', () => {
    render(<TablaMaridajeSelector siteConfig={{ contact: { email: 'x@y.z' } }} />);
    expect(screen.queryByRole('link', { name: /Reservar por WhatsApp/i })).toBeNull();
    expect(screen.getByText(/x@y\.z/)).toBeInTheDocument();
  });
});
