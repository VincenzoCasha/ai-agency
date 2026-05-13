import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../lib/eventsApi', () => ({
  submitEventReservation: vi.fn(),
}));

import { ReservationForm } from '../components/events/ReservationForm';
import { submitEventReservation } from '../lib/eventsApi';

function renderForm(extra = {}) {
  const onSuccess = vi.fn();
  render(
    <MemoryRouter>
      <ReservationForm
        eventSlug="cata-blancos"
        eventTitle="Cata de blancos"
        onSuccess={onSuccess}
        {...extra}
      />
    </MemoryRouter>,
  );
  return { onSuccess };
}

function fillValid() {
  fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Ana' } });
  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'ana@example.com' } });
  fireEvent.change(screen.getByLabelText(/Teléfono/i), { target: { value: '+34600111222' } });
}

describe('ReservationForm', () => {
  beforeEach(() => {
    submitEventReservation.mockReset();
  });

  it('flags required fields on empty submit', () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: /Solicitar reserva/i }));
    expect(screen.getByText(/Indícanos tu nombre/i)).toBeInTheDocument();
    expect(submitEventReservation).not.toHaveBeenCalled();
  });

  it('rejects party_size > 4 with WhatsApp suggestion', async () => {
    renderForm();
    fillValid();
    fireEvent.change(screen.getByLabelText(/Plazas/i), { target: { value: '5' } });
    fireEvent.click(screen.getByRole('button', { name: /Solicitar reserva/i }));
    expect(await screen.findByText(/Para grupos de más de 4, contáctanos por WhatsApp/i)).toBeInTheDocument();
  });

  it('happy path calls API with idempotencyKey and triggers onSuccess', async () => {
    submitEventReservation.mockResolvedValueOnce({
      ok: true, status: 201, data: { reservation_id: 'r1' },
    });
    const { onSuccess } = renderForm();
    fillValid();
    fireEvent.click(screen.getByRole('button', { name: /Solicitar reserva/i }));
    await waitFor(() => expect(submitEventReservation).toHaveBeenCalledTimes(1));
    const [slug, payload, opts] = submitEventReservation.mock.calls[0];
    expect(slug).toBe('cata-blancos');
    expect(payload.party_size).toBe(2);
    expect(opts.idempotencyKey).toBeTruthy();
    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
  });

  it('shows server-provided field errors on 422', async () => {
    submitEventReservation.mockResolvedValueOnce({
      ok: false, status: 422,
      error: { errors: [{ field: 'email', message: 'Ya inscrito' }] },
    });
    renderForm();
    fillValid();
    fireEvent.click(screen.getByRole('button', { name: /Solicitar reserva/i }));
    expect(await screen.findByText(/Ya inscrito/i)).toBeInTheDocument();
  });
});
