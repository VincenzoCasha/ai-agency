import React from 'react';
import { cn } from '../../lib/cn';

export function LifestylePhoto({
  src,
  alt,
  aspectRatio = 'aspect-[4/3]',
  className,
  priority = false,
  ...rest
}) {
  if (typeof alt !== 'string' || alt.length === 0) {
    throw new Error('LifestylePhoto: prop "alt" is required and must be a non-empty string.');
  }

  return (
    <div className={cn('relative overflow-hidden bg-bg-elevated', aspectRatio, className)}>
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        className="absolute inset-0 h-full w-full object-cover"
        {...rest}
      />
    </div>
  );
}
