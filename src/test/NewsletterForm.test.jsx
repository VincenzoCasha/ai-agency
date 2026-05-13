import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

vi.mock('../lib/newsletterApi', () => ({ subscribeNewsletter: vi.fn() }));

import { NewsletterForm } from '../components/forms/NewsletterForm';
import { subscribeNewsletter } from '../lib/newsletterApi';

describe('NewsletterForm', () => {
  beforeEach(() => {
    subscribeNewsletter.mockReset();
  });

  it('rejects invalid email', () => {
    render(<NewsletterForm requireConsent={false} />);
    fireEvent.change(screen.getByLabelText(/Correo/i), { target: { value: 'no-es-email' } });
    fireEvent.click(screen.getByRole('button', { name: /Suscribirme/i }));
    expect(screen.getByText(/válido/i)).toBeInTheDocument();
    expect(subscribeNewsletter).not.toHaveBeenCalled();
  });

  it('requires consent when requireConsent=true', () => {
    render(<NewsletterForm requireConsent />);
    fireEvent.change(screen.getByLabelText(/Correo/i), { target: { value: 'a@b.co' } });
    fireEvent.click(screen.getByRole('button', { name: /Suscribirme/i }));
    expect(screen.getByText(/consentimiento/i)).toBeInTheDocument();
    expect(subscribeNewsletter).not.toHaveBeenCalled();
  });

  it('submits and shows confirmation message', async () => {
    subscribeNewsletter.mockResolvedValueOnce({ ok: true, status: 202 });
    render(<NewsletterForm requireConsent={false} source="footer" />);
    fireEvent.change(screen.getByLabelText(/Correo/i), { target: { value: 'a@b.co' } });
    fireEvent.click(screen.getByRole('button', { name: /Suscribirme/i }));
    await waitFor(() => expect(subscribeNewsletter).toHaveBeenCalledTimes(1));
    const [payload] = subscribeNewsletter.mock.calls[0];
    expect(payload.email).toBe('a@b.co');
    expect(payload.source).toBe('footer');
    expect(await screen.findByText(/Revisa tu correo/i)).toBeInTheDocument();
  });

  it('shows API error message', async () => {
    subscribeNewsletter.mockResolvedValueOnce({ ok: false, status: 500, error: { detail: 'boom' } });
    render(<NewsletterForm requireConsent={false} />);
    fireEvent.change(screen.getByLabelText(/Correo/i), { target: { value: 'a@b.co' } });
    fireEvent.click(screen.getByRole('button', { name: /Suscribirme/i }));
    expect(await screen.findByText(/boom|completar la suscripción/i)).toBeInTheDocument();
  });
});
