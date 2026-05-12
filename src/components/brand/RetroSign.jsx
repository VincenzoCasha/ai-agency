import React from 'react';
import { cn } from '../../lib/cn';

const sizes = {
  sm: 'px-3 py-1 text-[11px] tracking-eyebrow',
  md: 'px-4 py-1.5 text-xs tracking-eyebrow',
  lg: 'px-5 py-2 text-sm tracking-eyebrow',
};

export function RetroSign({ text, as: Component = 'span', size = 'md', className, ...rest }) {
  return (
    <Component
      className={cn(
        'inline-flex items-center justify-center',
        'font-semibold uppercase text-crudo-bone',
        'bg-crudo-terracota rounded-md',
        'shadow-[inset_0_0_18px_rgba(255,180,120,0.45),0_2px_12px_rgba(255,138,71,0.25)]',
        sizes[size] || sizes.md,
        className,
      )}
      {...rest}
    >
      {text}
    </Component>
  );
}
