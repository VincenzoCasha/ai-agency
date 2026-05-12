import React from 'react';
import { cn } from '../../lib/cn';

export function BrandSticker({ rotation = -8, size = 80, className, ...rest }) {
  return (
    <img
      src="/img/brand/logo-color.png"
      alt=""
      aria-hidden="true"
      loading="lazy"
      decoding="async"
      width={size}
      height={size}
      className={cn('select-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]', className)}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: `rotate(${rotation}deg)`,
      }}
      {...rest}
    />
  );
}
