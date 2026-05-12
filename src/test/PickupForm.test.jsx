import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../lib/pickupApi', () => ({
  submitPickupOrder: vi.fn(),
}));

import { PickupForm } from '../components/tabla/PickupForm';
import { submitPickupOrder } from '../lib/pickupApi';

const ITEMS = [
  { id: 1, slug: 'manchego-curado', name: 'Manchego curado', quantity: 2, price_cents: 1450, is_alcohol: false },
];

const HOURS = {
  mon: '17:30-23:00',
  tue: '17:30-23:00',
  wed: '17:30-23:00',
  thu: '17:30-23:00',
  fri: '17:30-23:00',
  sat: '12:30-22:00',
  sun: '12:30-20:00',
};

function getPayloadItems() {
  return [{ product_id: 1, product_slug: 'manchego-curado', quantity: 2 }];
}

function renderForm(extraProps = {}) {
  const onSuccess = vi.fn();
  render(
    <MemoryRouter>
      <PickupForm
        items={ITEMS}
        totalCents={2900}
        hours={HOURS}
        getPayloadItems={getPayloadItems}
        onSuccess={onSuccess}
        {...extraProps}
      />
    </MemoryRouter>,
  );
  return { onSuccess };
}

function fillValid() {
  fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Ana García' } });
  fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'ana@example.com' } });
  fireEvent.change(screen.getByLabelText(/Teléfono/i), { target: { value: '+34600111222' } });
  // Pickup date: tomorrow
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const iso = `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
  fireEvent.change(screen.getByLabelText(/Día de recogida/i), { target: { value: iso } });
  // Slot: pick first option
  const slotSelect = screen.getByLabelText(/Hora/i);
  // Need to wait for options to populate (depends on date change re-render)
  return { iso, slotSelect };
}

describe('PickupForm', () => {
  beforeEach(() => {
    submitPickupOrder.mockReset();
  });

  it('renders payment notice', () => {
    renderForm();
    expect(
      screen.getByText(/El pago se realiza en CRUDO al recoger\. Te confirmaremos por WhatsApp/i),
    ).toBeInTheDocument();
  });

  it('shows field errors when submitting empty form', () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: /Reservar para recoger/i }));
    expect(screen.getByText(/Indícanos tu nombre/i)).toBeInTheDocument();
    expect(screen.getByText(/correo de contacto/i)).toBeInTheDocument();
    expect(submitPickupOrder).not.toHaveBeenCalled();
  });

  it('shows error for invalid email', () => {
    renderForm();
    fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'Ana' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'no-es-email' } });
    fireEvent.change(screen.getByLabelText(/Teléfono/i), { target: { value: '+34600111222' } });
    fireEvent.click(screen.getByRole('button', { name: /Reservar para recoger/i }));
    expect(screen.getByText(/no parece válido/i)).toBeInTheDocument();
  });

  it('happy path: submits payload without prices and calls onSuccess', async () => {
    submitPickupOrder.mockResolvedValueOnce({
      ok: true,
      status: 201,
      data: { order_id: 'po_123', total_cents: 2900, items: ITEMS },
    });
    const { onSuccess } = renderForm();
    const { iso } = fillValid();
    // Wait until slot select has options
    await waitFor(() => {
      const opts = screen.getByLabelText(/Hora/i).querySelectorAll('option:not([disabled])');
      expect(opts.length).toBeGreaterThan(0);
    });
    const slotSelect = screen.getByLabelText(/Hora/i);
    const firstSlot = slotSelect.querySelector('option:not([disabled])').value;
    fireEvent.change(slotSelect, { target: { value: firstSlot } });
    fireEvent.click(screen.getByRole('button', { name: /Reservar para recoger/i }));
    await waitFor(() => expect(submitPickupOrder).toHaveBeenCalledTimes(1));
    const [payload, opts] = submitPickupOrder.mock.calls[0];
    expect(payload.items).toEqual([{ product_id: 1, product_slug: 'manchego-curado', quantity: 2 }]);
    expect(payload.items[0]).not.toHaveProperty('price_cents');
    expect(payload.pickup_date).toBe(iso);
    expect(opts.idempotencyKey).toBeTruthy();
    await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
    expect(onSuccess.mock.calls[0][0].confirmation.order_id).toBe('po_123');
  });

  it('handles 422 alcohol guard with safe message and no success', async () => {
    submitPickupOrder.mockResolvedValueOnce({
      ok: false,
      status: 422,
      error: {
        code: 'ALCOHOL_NOT_ALLOWED_IN_PICKUP',
        detail: 'No se permiten productos con alcohol',
        errors: [],
      },
    });
    const { onSuccess } = renderForm();
    fillValid();
    await waitFor(() => {
      const opts = screen.getByLabelText(/Hora/i).querySelectorAll('option:not([disabled])');
      expect(opts.length).toBeGreaterThan(0);
    });
    const slotSelect = screen.getByLabelText(/Hora/i);
    const firstSlot = slotSelect.querySelector('option:not([disabled])').value;
    fireEvent.change(slotSelect, { target: { value: firstSlot } });
    fireEvent.click(screen.getByRole('button', { name: /Reservar para recoger/i }));
    await waitFor(() => expect(submitPickupOrder).toHaveBeenCalled());
    expect(await screen.findByText(/No se puede reservar alcohol online/i)).toBeInTheDocument();
    expect(onSuccess).not.toHaveBeenCalled();
  });

  it('shows network error message on status 0', async () => {
    submitPickupOrder.mockResolvedValueOnce({
      ok: false,
      status: 0,
      error: { detail: 'Network down' },
    });
    renderForm();
    fillValid();
    await waitFor(() => {
      const opts = screen.getByLabelText(/Hora/i).querySelectorAll('option:not([disabled])');
      expect(opts.length).toBeGreaterThan(0);
    });
    const slotSelect = screen.getByLabelText(/Hora/i);
    fireEvent.change(slotSelect, { target: { value: slotSelect.querySelector('option:not([disabled])').value } });
    fireEvent.click(screen.getByRole('button', { name: /Reservar para recoger/i }));
    expect(await screen.findByText(/No hay conexión con el servidor/i)).toBeInTheDocument();
  });
});
