import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LifestylePhoto } from '../components/brand/LifestylePhoto';

describe('LifestylePhoto', () => {
  it('renders the image with required alt text', () => {
    render(<LifestylePhoto src="/img/hero/hero-home-cheeseboard.png" alt="Tabla de quesos" />);
    const img = screen.getByAltText('Tabla de quesos');
    expect(img).toBeInTheDocument();
    expect(img.tagName).toBe('IMG');
    expect(img).toHaveAttribute('loading', 'lazy');
  });

  it('uses eager loading and fetchpriority=high when priority=true', () => {
    render(
      <LifestylePhoto
        src="/img/hero/hero-home-cheeseboard.png"
        alt="Hero"
        priority
      />,
    );
    const img = screen.getByAltText('Hero');
    expect(img).toHaveAttribute('loading', 'eager');
    expect(img.getAttribute('fetchpriority')).toBe('high');
  });

  it('throws when alt is missing', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() =>
      render(<LifestylePhoto src="/img/foo.jpg" alt="" />),
    ).toThrow(/alt/i);
    spy.mockRestore();
  });
});
