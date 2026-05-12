import React from 'react';
import { cn } from '../../lib/cn';

export function FieldError({ id, message, className, ...rest }) {
  if (!message) return null;
  return (
    <p
      id={id}
      role="alert"
      className={cn('mt-1 text-sm text-error', className)}
      {...rest}
    >
      {message}
    </p>
  );
}
