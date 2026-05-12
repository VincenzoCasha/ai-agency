import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RetroSign } from '../components/brand/RetroSign';

describe('RetroSign', () => {
  it('renders the text', () => {
    render(<RetroSign text="DE TEMPORADA" />);
    expect(screen.getByText('DE TEMPORADA')).toBeInTheDocument();
  });

  it('applies size classes for sm/md/lg', () => {
    const { rerender } = render(<RetroSign text="A" size="sm" />);
    expect(screen.getByText('A').className).toMatch(/text-\[11px\]/);
    rerender(<RetroSign text="B" size="lg" />);
    expect(screen.getByText('B').className).toMatch(/text-sm/);
  });

  it('renders as the requested element when "as" prop is provided', () => {
    render(<RetroSign text="HEADING" as="h2" />);
    const node = screen.getByText('HEADING');
    expect(node.tagName).toBe('H2');
  });
});
