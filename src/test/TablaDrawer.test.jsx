import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { TablaDrawer } from '../components/tabla/TablaDrawer';
import { addItem, clearDraft, TABLA_DRAFT_STORAGE_KEY } from '../lib/tablaDraft';

const CHEESE = {
  id: 1,
  slug: 'manchego-curado',
  name: 'Manchego curado',
  price_cents: 1450,
  is_alcohol: false,
};

function renderDrawer(props = {}) {
  return render(
    <MemoryRouter>
      <TablaDrawer open onClose={() => {}} {...props} />
    </MemoryRouter>,
  );
}

describe('TablaDrawer', () => {
  beforeEach(() => {
    window.localStorage.removeItem(TABLA_DRAFT_STORAGE_KEY);
    clearDraft();
  });

  it('renders empty state when no items', () => {
    renderDrawer();
    expect(screen.getByText(/Aún no has elegido quesos/i)).toBeInTheDocument();
  });

  it('lists items with payment notice and wine WhatsApp note', () => {
    addItem(CHEESE, 2);
    renderDrawer();
    expect(screen.getByText('Manchego curado')).toBeInTheDocument();
    expect(screen.getByText(/Para reservar vinos, escríbenos por WhatsApp/i)).toBeInTheDocument();
    expect(
      screen.getByText(/El pago se realiza en CRUDO al recoger\. Te confirmaremos por WhatsApp/i),
    ).toBeInTheDocument();
  });

  it('CTA navigates to /mi-tabla and is enabled when there are items', () => {
    addItem(CHEESE, 1);
    renderDrawer();
    const cta = screen.getByRole('link', { name: /Reservar para recoger/i });
    expect(cta).toHaveAttribute('href', '/mi-tabla');
  });

  it('does not render when open=false', () => {
    render(
      <MemoryRouter>
        <TablaDrawer open={false} onClose={() => {}} />
      </MemoryRouter>,
    );
    expect(screen.queryByRole('dialog')).toBeNull();
  });

  it('closes on Escape key', () => {
    addItem(CHEESE, 1);
    let closed = false;
    renderDrawer({ onClose: () => { closed = true; } });
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(closed).toBe(true);
  });
});
