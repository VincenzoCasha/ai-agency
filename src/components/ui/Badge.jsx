import React from 'react';
import { cn } from '../../lib/cn';

/**
 * Badge para metadatos secundarios. Diferente del `Tag`: el Badge es mas
 * pequeno y no usa borde.
 */
export function Badge({ tone = 'default', className, children, ...rest }) {
  const tones = {
    default: 'bg-bg-elevated text-text-secondary',
    accent: 'bg-accent-soft text-accent',
    success: 'bg-success/15 text-success',
    warning: 'bg-warning/15 text-warning',
  };
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[0.7rem] font-semibold uppercase tracking-eyebrow',
        tones[tone] || tones.default,
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
