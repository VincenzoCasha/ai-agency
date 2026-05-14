import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CelebraStrip } from '../components/events/CelebraStrip';

const SITE = {
  contact: {
    whatsapp_public: '+34 650 13 18 61',
    email: 'crudomov@gmail.com',
  },
};

describe('CelebraStrip', () => {
  it('shows owner email and prefilled WhatsApp link for private event inquiry', () => {
    render(<CelebraStrip siteConfig={SITE} />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(/ponte en contacto/i);
    const mailto = screen.getByRole('link', { name: /crudomov@gmail\.com/i });
    expect(mailto.getAttribute('href')).toMatch(/^mailto:crudomov@gmail\.com/);
    expect(decodeURIComponent(mailto.getAttribute('href'))).toContain('Evento privado en CRUDO');
    const wa = screen.getByRole('link', { name: /WhatsApp/i });
    expect(wa.getAttribute('href')).toMatch(/wa\.me\/34650131861/);
    expect(decodeURIComponent(wa.getAttribute('href'))).toContain('evento privado');
  });

  it('falls back to default email when siteConfig is empty and hides WhatsApp', () => {
    render(<CelebraStrip siteConfig={{}} />);
    expect(screen.getByRole('link', { name: /crudomov@gmail\.com/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /^WhatsApp$/i })).toBeNull();
  });
});
