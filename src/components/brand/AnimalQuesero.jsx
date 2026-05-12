import React from 'react';
import { cn } from '../../lib/cn';

const SOURCES = {
  1: '/img/brand/animal-quesero-1.png',
  2: '/img/brand/animal-quesero-2.png',
};

export function AnimalQuesero({ variant = '1', size = 160, className, ...rest }) {
  const src = SOURCES[variant] || SOURCES['1'];
  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      width={size}
      height={size}
      className={cn('select-none', className)}
      style={{ width: `${size}px`, height: 'auto' }}
      {...rest}
    />
  );
}
