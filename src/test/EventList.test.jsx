import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { EventList } from '../components/events/EventList';

const FUTURE = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
const PAST = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

const EVENTS = [
  { id: 1, slug: 'cata-blancos', title: 'Cata de blancos', starts_at: FUTURE, location: 'CRUDO', seats_left: 8, capacity: 12 },
  { id: 2, slug: 'pasada', title: 'Cata pasada', starts_at: PAST, location: 'CRUDO' },
  { id: 3, slug: 'pocas-plazas', title: 'Pocas plazas', starts_at: FUTURE, few_seats_left: true, seats_left: 2, capacity: 12 },
  { id: 4, slug: 'lleno', title: 'Lleno', starts_at: FUTURE, is_full: true, capacity: 10 },
];

function renderList(props) {
  return render(
    <MemoryRouter>
      <EventList {...props} />
    </MemoryRouter>,
  );
}

describe('EventList', () => {
  it('shows only future events ordered ascending', () => {
    renderList({ events: EVENTS, status: 'ok', loading: false });
    expect(screen.getByText('Cata de blancos')).toBeInTheDocument();
    expect(screen.queryByText('Cata pasada')).toBeNull();
  });

  it('shows few-seats badge', () => {
    renderList({ events: [EVENTS[2]], status: 'ok', loading: false });
    expect(screen.getByText(/Quedan 2 plazas/i)).toBeInTheDocument();
  });

  it('shows full badge for is_full', () => {
    renderList({ events: [EVENTS[3]], status: 'ok', loading: false });
    expect(screen.getByText(/Completo/i)).toBeInTheDocument();
  });

  it('renders empty state with contact CTA when no upcoming', () => {
    renderList({ events: [EVENTS[1]], status: 'ok', loading: false });
    expect(screen.getByText(/Sin eventos por ahora/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Contacto/i })).toHaveAttribute('href', '/contacto');
  });

  it('renders error state', () => {
    renderList({ events: [], status: 'error', loading: false, error: { detail: 'boom' } });
    expect(screen.getByText(/No pudimos cargar los eventos/i)).toBeInTheDocument();
  });
});
