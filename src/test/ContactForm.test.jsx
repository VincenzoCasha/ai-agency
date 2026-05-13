import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

vi.mock('../lib/inquiriesApi', () => ({ submitInquiry: vi.fn() }));

import { ContactForm } from '../components/forms/ContactForm';
import { submitInquiry } from '../lib/inquiriesApi';
import { _drainAnalyticsForTest } from '../lib/analytics';

function setConsentAllowed() {
  window.localStorage.setItem(
    'crudo:consent:v1',
    JSON.stringify({
      version: '1',
      consent_id: 'test',
      timestamp: new Date().toISOString(),
      analytics: true,
      marketing: true,
      preferences: false,
    }),
  );
}

describe('ContactForm', () => {
  beforeEach(() => {
    submitInquiry.mockReset();
    window.localStorage.clear();
    _drainAnalyticsForTest();
  });

  it('flags missing required fields', () => {
    render(<ContactForm />);
    fireEvent.click(screen.getByRole('button', { name: /Enviar consulta/i }));
    expect(screen.getByText(/Indícanos tu nombre/i)).toBeInTheDocument();
    expect(submitInquiry).not.toHaveBeenCalled();
  });

  it('submits CONTACT inquiry and shows success without exposing PII to analytics', async () => {
    setConsentAllowed();
    submitInquiry.mockResolvedValueOnce({ ok: true, status: 201, data: { id: 'i1' } });
    render(<ContactForm />);
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Ana' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'ana@example.com' } });
    fireEvent.change(screen.getByLabelText(/Mensaje/i), { target: { value: 'Hola, tengo una consulta sobre el manchego.' } });
    fireEvent.click(screen.getByRole('button', { name: /Enviar consulta/i }));
    await waitFor(() => expect(submitInquiry).toHaveBeenCalledTimes(1));
    const [payload] = submitInquiry.mock.calls[0];
    expect(payload.type).toBe('CONTACT');
    expect(payload.email).toBe('ana@example.com');
    expect(await screen.findByText(/Gracias por escribirnos/i)).toBeInTheDocument();
    const events = _drainAnalyticsForTest();
    const lead = events.find((e) => e.event === 'generate_lead');
    expect(lead).toBeTruthy();
    // No PII in analytics payload
    expect(JSON.stringify(lead.payload)).not.toMatch(/ana@example/);
  });
});
