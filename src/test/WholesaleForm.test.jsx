import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';

vi.mock('../lib/inquiriesApi', () => ({ submitInquiry: vi.fn() }));

import { WholesaleForm } from '../components/forms/WholesaleForm';
import { submitInquiry } from '../lib/inquiriesApi';

describe('WholesaleForm', () => {
  beforeEach(() => {
    submitInquiry.mockReset();
  });

  it('flags required fields', () => {
    render(<WholesaleForm />);
    fireEvent.click(screen.getByRole('button', { name: /Enviar consulta mayorista/i }));
    expect(screen.getByText(/Indícanos el nombre del negocio/i)).toBeInTheDocument();
    expect(submitInquiry).not.toHaveBeenCalled();
  });

  it('submits WHOLESALE with business_name in payload', async () => {
    submitInquiry.mockResolvedValueOnce({ ok: true, status: 201 });
    render(<WholesaleForm />);
    fireEvent.change(screen.getByLabelText(/Nombre del negocio/i), { target: { value: 'Bar Pepe' } });
    fireEvent.change(screen.getByLabelText(/Persona de contacto/i), { target: { value: 'Pepe' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'pepe@bar.com' } });
    fireEvent.change(screen.getByLabelText(/Teléfono/i), { target: { value: '+34600111222' } });
    fireEvent.change(screen.getByLabelText(/Cuéntanos/i), {
      target: { value: 'Necesitamos quesos para tabla de fin de semana.' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Enviar consulta mayorista/i }));
    await waitFor(() => expect(submitInquiry).toHaveBeenCalledTimes(1));
    const [payload] = submitInquiry.mock.calls[0];
    expect(payload.type).toBe('WHOLESALE');
    expect(payload.payload.business_name).toBe('Bar Pepe');
    expect(await screen.findByText(/Estudiamos disponibilidad/i)).toBeInTheDocument();
  });

  it('does not behave like ecommerce: no checkout/cart language', () => {
    render(<WholesaleForm />);
    expect(screen.queryByText(/Pagar|Carrito|Checkout/i)).toBeNull();
  });
});
