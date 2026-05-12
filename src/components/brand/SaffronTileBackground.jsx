import React from 'react';
import { cn } from '../../lib/cn';

const TILE_SVG = encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'>
    <rect width='64' height='64' fill='#E8B547'/>
    <path d='M0 32h64M32 0v64' stroke='#C99A36' stroke-width='1.5' opacity='0.55'/>
  </svg>`,
);

const intensities = {
  subtle: 'opacity-[0.12]',
  normal: 'opacity-25',
};

export function SaffronTileBackground({
  as: Component = 'div',
  intensity = 'subtle',
  className,
  children,
  ...rest
}) {
  return (
    <Component className={cn('relative isolate', className)} {...rest}>
      <div
        aria-hidden="true"
        className={cn('pointer-events-none absolute inset-0 -z-10', intensities[intensity])}
        style={{
          backgroundImage: `url("data:image/svg+xml;utf8,${TILE_SVG}")`,
          backgroundSize: '64px 64px',
          backgroundRepeat: 'repeat',
        }}
      />
      {children}
    </Component>
  );
}
