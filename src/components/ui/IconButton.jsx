import React from 'react';
import { cn } from '../../lib/cn';

export const IconButton = React.forwardRef(function IconButton(
  { ariaLabel, 'aria-label': ariaLabelProp, className, children, type = 'button', ...rest },
  ref,
) {
  const label = ariaLabel || ariaLabelProp;
  if (!label) {
    // En desarrollo, avisamos en consola si no se entrega aria-label.
    if (typeof console !== 'undefined') {
      console.warn('[IconButton] requiere aria-label');
    }
  }
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      className={cn(
        'inline-flex items-center justify-center w-11 h-11 rounded-md',
        'text-text-primary hover:bg-bg-elevated border border-transparent hover:border-border',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
});
