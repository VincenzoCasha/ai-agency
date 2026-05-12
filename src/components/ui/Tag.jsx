import React from 'react';
import { cn } from '../../lib/cn';

const tones = {
  default: 'border-border text-text-secondary',
  gold: 'border-gold/50 text-gold',
  warning: 'border-warning/50 text-warning',
  success: 'border-success/50 text-success',
  error: 'border-error/55 text-error',
};

export function Tag({ tone = 'default', className, children, ...rest }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-pill',
        'border bg-bg-secondary/40 text-xs font-semibold uppercase tracking-eyebrow',
        tones[tone] || tones.default,
        className,
      )}
      {...rest}
    >
      {children}
    </span>
  );
}
