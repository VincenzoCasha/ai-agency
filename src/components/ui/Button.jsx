import React from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '../../lib/cn';
import { Spinner } from './Spinner';

const button = cva(
  [
    'inline-flex items-center justify-center gap-2 select-none',
    'min-h-[44px] px-4 py-2 rounded-md font-body font-semibold',
    'transition-colors transition-shadow',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary',
    'disabled:opacity-60 disabled:cursor-not-allowed',
    'whitespace-nowrap',
  ].join(' '),
  {
    variants: {
      variant: {
        primary: 'bg-accent text-text-inverse hover:bg-accent-hover shadow-soft',
        secondary:
          'bg-bg-elevated text-text-primary border border-border-strong hover:border-gold',
        ghost:
          'bg-transparent text-text-primary hover:bg-bg-elevated border border-transparent hover:border-border',
        danger:
          'bg-error text-text-primary hover:opacity-90 border border-transparent',
        whatsapp:
          'bg-[#25D366] text-[#06351F] hover:bg-[#2EE47A] shadow-soft',
      },
      size: {
        sm: 'min-h-[40px] text-sm px-3',
        md: 'text-[0.95rem]',
        lg: 'min-h-[52px] text-base px-5',
      },
      block: { true: 'w-full', false: '' },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
      block: false,
    },
  },
);

export const Button = React.forwardRef(function Button(
  {
    as: Tag = 'button',
    type,
    variant,
    size,
    block,
    loading,
    disabled,
    className,
    children,
    ...rest
  },
  ref,
) {
  const finalType = Tag === 'button' && !type ? 'button' : type;
  return (
    <Tag
      ref={ref}
      type={finalType}
      disabled={Tag === 'button' ? disabled || loading : undefined}
      aria-busy={loading || undefined}
      className={cn(button({ variant, size, block }), className)}
      {...rest}
    >
      {loading ? <Spinner size={16} aria-hidden="true" /> : null}
      <span>{children}</span>
    </Tag>
  );
});
